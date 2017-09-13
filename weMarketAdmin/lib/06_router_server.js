if(Meteor.isServer){
  // 微信登录callback
  Router.route('/oauth/wechat',{ where: 'server'}).get(function(){
    var appid = 'wxf5fdcd705a634bc9';
    var app_secret = 'e1d302d0e7f91b7d989eb42ddbc2ab5e';
    var userInfo = {};

    var code = this.request.query.code;
    var token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+app_secret+'&code='+code+'&grant_type=authorization_code';


    console.log('code = ',code)
    var self = this;
    HTTP.get(token_url, function(error, result){
      if(!error){
        var resp = result.content;
        console.log(resp);
        var access_token = resp.access_token;
        var openId = resp.openid;

        var user_info_url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+ access_token +'&openid='+ openId +'&lang=zh_CN';

        HTTP.get(user_info_url, function(error, result){
          if(!error){
              var resp = result.content;
              console.log(resp);
              return self.response.end(JSON.stringify(resp));
          } else {
            return self.response.end('result: error where get userinfo');
          }
        });
      } else {
        return self.response.end('result: error where get access_token');
      }
    });
    
  });
}
