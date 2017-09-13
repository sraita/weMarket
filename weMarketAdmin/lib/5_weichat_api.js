// server
if(Meteor.isServer){
  getSignatureFromServer = function(){
    var token = '',
        ticket = '',
        appId = '',
        appSecret  = '';
    
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

    SyncedCron.add({
      name: 'Update WeChat token and API',
      schedule: function(parser) {
        return parser.text('every 1 hour');
      },
      job: function() {
        updateTokenAndTicket();
      }
    });
    SyncedCron.start();

    updateTokenAndTicket();
  }
}