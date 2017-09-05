var OAuth = Npm.require('wechat-oauth');
var client = new OAuth('apppid','afd33592eb230c2f8f9936881b2383ba');

var oauthApi = new OAuth('appid','sercet', function(openid, callback) {
  Token.getToken(openid, callback);
}, function(openid, token, callback){
  Token.setToken(openid, token, callback);
});
