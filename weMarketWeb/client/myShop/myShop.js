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