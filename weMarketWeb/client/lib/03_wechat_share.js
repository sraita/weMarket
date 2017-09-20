if(Meteor.isClient){
  Meteor.startup(function(){
    Meteor.setTimeout(function(){
      var shareUrl = window.location.href;
      shareUrl = shareUrl.split('#')[0];
      if(Session.get('productContent')){
        var seller_id = Router.current().params.query.s || localStorage.getItem('seller_id') || 'JWyJfabzzpq9grw4Q';
        shareUrl = 'http://market.aridcdn.cn/shareProduct/'+Session.get('productContent')._id + seller_id;
      }
      calcWeChatSignature(shareUrl);
    },300);
    
    window.isWeiXinFunc = function(){
      var ua = window.navigator.userAgent.toLowerCase();
      var M = ua.match(/MicroMessenger/i);
      if(M && M[0] == 'micromessenger'){
        return true;
      } else {
        return false;
      }
    }
    var loadScript = function(url, callback){
      jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true,
        cache: true
      });
    }

    var wechatSetup = function(signatureResult){
      console.log('wechat sign=',signatureResult);
      wx.config({
        debug: false,
        appId: signatureResult.appid,
        timestamp: signatureResult.timestamp,
        nonceStr: signatureResult.nonceStr,
        signature: signatureResult.signature,
        jsApiList:[
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone'
        ]
      });
    }

    var wechatReady = function(testing){
      var title = Session.get('documentTitle') || '微商传播机';
      var description = '0成本快速开店';
      var shareUrl = window.location.href;
      shareUrl = shareUrl.split('#')[0];
      if(Session.get('productContent')){
        var seller_id = Router.current().params.query.s || localStorage.getItem('seller_id') || 'JWyJfabzzpq9grw4Q';
        shareUrl = 'http://market.aridcdn.cn/shareProduct/'+Session.get('productContent')._id + seller_id;
      }
      
      if(Session.get('productContent') && Session.get('productContent').desc){
        description = Session.get('productContent').desc;
      }
      description = description.slice(0,90);
      var timelineData = {
        title: Session.get('documentTitle'),
        desc: description,
        link: shareUrl,
        imgUrl: Session.get('mainImage') || '/home/nav_4.png',
        success: function(){
          console.log('share success!');
        },
        cancel: function(){
          console.log('user cancel share');
        }
      };

      wx.onMenuShareTimeline(timelineData);
      wx.onMenuShareAppMessage(timelineData);
      wx.onMenuShareQQ(timelineData);
      wx.onMenuShareWeibo(timelineData);
      wx.onMenuShareQZone(timelineData);

    }

    var setupWechat = function(url){
      if(!Session.get('sign_status_'+url)){
        Session.set('sign_status_'+url,'starting');
      } else if (Session.equals('sign_status_'+url,'starting')){
        return;
      }

      HTTP.get('/sign/'+encodeURIComponent(url),function(error, result){
        if(error){
          Session.set('sign_status_'+url, 'failed');
          console.log('Get wechat signature failed');
          Meteor.setTimeout(function(){
            setupWechat(url);
          },3000);
        } else {
          var signatureResult = JSON.parse(result.content);
          Session.set('sign_status_'+url, 'done');
          console.log('Got wechat signature ' + JSON.stringify(signatureResult));

          Meteor.setTimeout(function(){
            Session.set('sign_status_'+url,'expired');
          },30000);
          wechatSetup(signatureResult);
          wx.ready(wechatReady);
        }
      });
    }

    window.calcWeChatSignature = function(url){
      if(isWeiXinFunc()){
        if(typeof(wx) == 'undefined'){
          loadScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function(){
            setupWechat(url);
          });
        } else {
          setupWechat(url);
        }
      }
    }

  });
}