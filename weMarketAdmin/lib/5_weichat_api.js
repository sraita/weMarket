// server
if(Meteor.isServer){

  var token = '',
      ticket = '',
      appId = 'wxf5fdcd705a634bc9',
      appSecret  = 'e1d302d0e7f91b7d989eb42ddbc2ab5e';
  
  var jsSHA = Npm.require('jssha');
  var requestUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appId+'&secret='+appSecret;

  // 随机字符串产生函数
  var createNonceStr = function() {
    return Math.random().toString(36).substr(2, 15);
  };

  // 时间戳产生函数
  var createTimeStamp = function() {
    return parseInt(new Date().getTime() / 1000) + '';
  };

  // 计算签名
  var calcSignature = function(ticket, noncestr, ts ,url) {
    var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
    var shaObj = new jsSHA('SHA-1', 'TEXT');
    shaObj.update(str);
    return shaObj.getHash('HEX');
  };

  // 获取微信签名所需的 ticket
  var generateSignture = function(url){
    var ts = createTimeStamp();
    var nonceStr = createNonceStr();
    var signature = calcSignature(ticket, nonceStr, ts, url);
    console.log('Ticket is '+ ticket + 'Signature is '+ signature);

    var returnSignatures = {
      nonceStr: nonceStr,
      appid: appId,
      signature: signature,
      url: url
    };
    return returnSignatures;
  };

  // 获取微信签名所需的 ticket
  var updateTicket = function(access_token) {
    HTTP.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token +'&type=jsapi', function(error, result){
      if(!error){
        var resp = result.data;
        var ticket = resp.ticket;
        console.log('Ticket is '+ ticket);
      }
    });
  }

  var updateTokenAndTicket = function(){
    HTTP.get(requestUrl, function(error, result) {
      if(!error){
        console.log('access_token = '+ JSON.stringify(result.data));
        var token = result.data.access_token;
        updateTicket(token);
      }
    });
  };
  updateTokenAndTicket();
  Meteor.setInterval(function(){
    updateTokenAndTicket();
  },60 * 60 * 1000);

  Router.route('/sign/:url',{ where: 'server'}).get(function(){
    var originalUrl = this.request.originalUrl;
    var url = originalUrl.slice(6,originalUrl.length);
    url = decodeURIComponent(url);
    console.log('To sign this url: '+url);
    var result = generateSignture(url);
    this.response.end(JSON.stringify(result));
  });
}