Template.home.onRendered(function(){
  var seller_id = Router.current().params.query.s || 'RTsZ64Cc8iyoc4BmW';
  // Meteor.subscribe('products_by_distributor',Meteor.userId(), 100);
  Meteor.subscribe('all-products');
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      autoplay : 5000,
      loop: true
  });

  if(Meteor.userId()){
    // 成功登录主页后自动成为分销商， 同时创建相应的店铺
    Meteor.setTimeout(function(){
      var user = Meteor.user();
      var role = user.profile.role || [];
      if(role.indexOf('distributor') < 0){
        role.push('distributor');
        Meteor.call('updateUserRole',user._id, role);
      }
    },1000);
  }
});

Template.home.helpers({
  products: function(){
    // return DistributorProducts.find({distributor_id: Meteor.userId()}, {limit: 100}).fetch();
    return Products.find({},{sort:{createdAt:-1}}).fetch();
  }
});

Template.home.events({
  'click #selectProducts': function(e){
    return PUB.page('/categories/all');
  }
})