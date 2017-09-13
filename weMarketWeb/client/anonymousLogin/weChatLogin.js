var appid = 'wxf5fdcd705a634bc9';
var app_secret = 'e1d302d0e7f91b7d989eb42ddbc2ab5e';
var scope = 'snsapi_userinfo';
var state = Date.now();

var redirect_uri = encodeURIComponent('market.raidcdn.cn/oauth/wexhat');
var auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+
               '&redirect_uri='+redirect_uri+
               '&response_type=code&scope='+scope+
               '&state='+state+'#wechat_redirect';



// {    "openid":" OPENID",  
// " nickname": NICKNAME,   
// "sex":"1",   
// "province":"PROVINCE"   
// "city":"CITY",   
// "country":"COUNTRY",    
// "headimgurl":    "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ
// 4eMsv84eavHiaiceqxibJxCfHe/46",  
// "privilege":[ "PRIVILEGE1" "PRIVILEGE2"     ],    
// "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL" 
// } 
getWeXinUserInfo = function(acccess_token, openId){
    var url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+ acccess_token+'&openid='+ openId+'&lang=zh_CN';
    HTTP.get(url, function(error, result){
        if(!error){
            var resp = JSON.parse(result.content);
            Accounts.createUser({
              username: openId,
              password: '123456',
              'profile':{
                name:resp.nickname,
                province: resp.province,
                city: resp.city,
                country: resp.country,
                icon: headimgurl,
                is_wexin: true
              }
            },function(error){
              console.log('Registration Error is '+JSON.stringify(error));
              if(!error){
                localStorage.setItem('user-openid',openId);
                Meteor.loginWithPassword(openId, '123456', function(error){
                  if(error){
                    console.log(error)
                  }

                });
              }
            });
        }
    });
}

window.loginByOpenId = function(){
    var openid = localStorage.getItem('user-openid');
    Meteor.loginWithPassword(openId, '123456', function(error){
        if(error){
          console.log(error)
        }

    });
}

// if(Meteor.isClient){
//     // 检查用户是否登录
//     if(!Meteor.userId()){
//         console.log('user not login');
//         Meteor.SET
//         var openId = Router.current().params.openId;
//         var access_token = Router.current().params.acccess_token;
    
//         if(!openId && !access_token){
//             return;
//         }
//         getWeXinUserInfo(access_token,openId);
//     }
// }
