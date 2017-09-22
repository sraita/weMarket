Template.myShop.onRendered(function(){
  var shopId = Router.current().params._id;
  Meteor.subscribe('shop_products',shopId,'all');
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      autoplay : 5000,
      loop: true
  });
  var shareUrl = 'http://market.raidcdn.cn/shop/';
  shareUrl += shopId;
  console.log(shareUrl);
  calcWeChatSignature(shareUrl);
});

Template.myShop.helpers({
  products: function(){
    var categories = this.categories || [];
    return Products.find({category_id:{$in:categories}},{sort:{createdAt:-1}}).fetch();
  },
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

Template.myShop.events({
  // 分享店铺提示
  'click #share': function(e){
    $("#myShopShareTip").popup();
  },
  // 店铺设置
  'click #setting': function(e){
    var _id = Router.current().params._id;
    return PUB.page('/myShop/setting/'+_id);
  }
})