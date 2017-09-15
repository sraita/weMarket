if(Meteor.isServer){
  
  // 微信登录callback
  Router.route('/oauth/wechat',{ where: 'server'}).get(function(){
    var appid = 'wxf5fdcd705a634bc9';
    var app_secret = 'e1d302d0e7f91b7d989eb42ddbc2ab5e';
    var userInfo = {};

    // var returnUrl = decodeURIComponent(this.request.query.currUrl);
    var returnUrl = '/';

    var code = this.request.query.code;
    var token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+app_secret+'&code='+code+'&grant_type=authorization_code';


    console.log('code = ',code)

    var responseLoginWith = function(openid){
      var result = {};
      if(openid){
        result.userId = Meteor.users.findOne({'services.wechat.openid': openid})._id;
      } else {
        var html = '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title>微商传播机</title>';
        html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />\r\n';
        html += '<script type="text/javascript">\r\n';
        html += 'location = "/";';
        html += '</script>\r\n';
        html += '</head><body>\r\n';
        html += '</body></html>';
        
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        return response.end(html);
      }
      var stampedLoginToken = Accounts._generateStampedLoginToken();
      Accounts._insertLoginToken(result.userId, stampedLoginToken);
      result = {
        id: result.userId,
        token: stampedLoginToken.token,
        tokenExpires: Accounts._tokenExpiration(stampedLoginToken.when)
      };
      
      var html = '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8" /><title>微商传播机</title>';
      html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />\r\n';
      html += '<script type="text/javascript">\r\n';
      html += 'window.localStorage.setItem("Meteor.userId", "'+result.id+'");';
      html += 'window.localStorage.setItem("Meteor.loginToken", "'+result.token+'");';
      html += 'window.localStorage.setItem("Meteor.loginTokenExpires", "'+result.tokenExpires+'");';
      html += 'location = "'+returnUrl+'";';
      html += '</script>\r\n';
      html += '</head><body>\r\n';
      html += '</body></html>';
      
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.cookie('meteor_login_token', result.token, {maxAge: Accounts._getTokenLifetimeMs()-3600*1000, path:'/'});
      return response.end(html);
    };

    var loginFail = function () {
      responseLoginWith();
    };

    if(!code){
      return loginFail();
    }

    var self = this;
    HTTP.get(token_url, function(error, result){
      if(!error){
        var resp = JSON.parse(result.content);
        console.log(JSON.stringify(resp));
        var access_token = resp.access_token;
        var openId = resp.openid;

        var user_info_url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+ access_token +'&openid='+ openId +'&lang=zh_CN';
        console.log(user_info_url);

        HTTP.get(user_info_url, function(error, result){
          if(!error){
              var resp = JSON.parse(result.content);
              console.log(JSON.stringify(resp));
              // 获得微信用户信息
              var profile = {
                name: resp.nickname,
                icon: resp.headimgurl,
                province: resp.province,
                city: resp.city,
                country: resp.country,
                sex: (resp.sex === '1' || resp.sex === 1) ? '男' : (resp.sex === 2 || resp.sex === 2 ? '女' : undefined)
              }
              if(user){

              }
              Accounts.updateOrCreateUserFromExternalService('wechat', {
                openid: resp.openid,
                nickname: resp.nickname,
                sex: resp.sex,
                province: resp.province,
                city: resp.city,
                country: resp.country,
                headimgurl: resp.headimgurl,
                privilege: resp.privilege,
                unionid: resp.unionid
              }, {
                createdAt: new Date(),
                profile: profile,
              });

              Meteor.users.update({'services.wechat.openid': resp.openid}, {$set: {
                isWeChat: true
              }});
              
              return responseLoginWith(resp.openid);
          } else {
            return loginFail();
          }
        });
      } else {
        return loginFail();
      }
    });
    
  });
}
