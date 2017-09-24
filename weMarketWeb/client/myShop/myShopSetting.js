Template.myShopSetting.helpers({
  shopName: function(){
    var user = Meteor.user();
    if(user){
      userName = user.profile.nickname || user.username;
      shopName = this.name || user.profile.shopName || userName + '的店铺';
      return shopName;
    }
    return '';
  }
});

Template.myShopSetting.events({
  'click #confirm': function(e){
    var shopName = $('#shopName').val(),
        name = $('#name').val(),
        mobile = Number($('#mobile').val()),
        alipay = $('#alipay').val();

    if(!shopName || !name || !mobile || !alipay){
      return $.toast('请完整填写','cancel');
    }
    if(!isMobileMumber(mobile)){
      return $.toast('手机号码错误','cancel');
    }

    $.showLoading('处理中')
    Shops.update({_id: Router.current().params._id},{
      $set:{
        'name':shopName,
        'user.realname':name,
        'user.mobile':mobile,
        'user.alipay':alipay
      }
    },function(error, result){
      $.hideLoading();
      if(error){
        console.log(error);
        return $.toast('请重试','cancel');
      }
      $.toast('已保存');
      Meteor.setTimeout(function(){
        Meteor.users.update({_id: Meteor.userId()},{
          $set:{
            'profile.shopName':shopName,
            'profile.realname':name,
            'profile.mobile':mobile,
            'profile.alipay':alipay
          }
        });
        PUB.back();
      },500);
    })
  }
})