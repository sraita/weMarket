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

  Router.route('restapi/qr-company',{where: 'server'})
  .get(function() {
    var companyId = this.params.query.id; Router.route('/reporter/:_id', function(req, res, next){
      var data = {
        companyId: this.params._id
      }
      if(Company.find({_id:this.params._id}).count() === 0){
        res.writeHead(404, {
          'Content-Type': 'text/html'
        });
        res.end('<head>\
          <meta charset="utf-8">\
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">\
          <title>没有查询到相关信息</title>\
        </head>\
        <body><h1 style="text-align:center">没有查询到相关信息</h1><hr/></body>', data);
      }
      var reporterHTML = SSR.render('dailyRepoter',data);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(reporterHTML, data)
    },{where: 'server'});
  });
}
