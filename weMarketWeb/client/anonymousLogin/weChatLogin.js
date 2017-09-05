var appid = 'wx5ca4836ebbda7287';
var app_secret = 'afd33592eb230c2f8f9936881b2383ba';
var scope = 'snsapi_userinfo';
var state = Date.now();

var redirect_uri = encodeURIComponent('host1.tiegushi.com');
var auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+
               '&redirect_uri='+redirect_uri+
               '&response_type=code&scope='+scope+
               '&state='+state+'#wechat_redirect';

var code = '';
var token_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+
                '&secret='+app_secret+'&code='+code+'&grant_type=authorization_code';