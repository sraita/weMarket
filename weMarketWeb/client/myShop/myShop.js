Template.myShop.onRendered(function(){
  var seller_id = Router.current().params.query.s || 'RTsZ64Cc8iyoc4BmW';
  Meteor.subscribe('all-products');
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      autoplay : 5000,
      loop: true
  });
});

Template.myShop.helpers({
  products: function(){
    // return DistributorProducts.find({distributor_id: Meteor.userId()}, {limit: 100}).fetch();
    return Products.find({},{sort:{createdAt:-1}}).fetch();
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