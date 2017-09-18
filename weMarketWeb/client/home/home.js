Template.home.onRendered(function(){
  var seller_id = Router.current().params.query.s || 'RTsZ64Cc8iyoc4BmW';
  Meteor.subscribe('products_by_distributor',Meteor.userId(), 100);
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      autoplay : 5000,
      loop: true
  });
});

Template.home.helpers({
  products: function(){
    return DistributorProducts.find({distributor_id: Meteor.userId()}, {limit: 100}).fetch();
  }
});

Template.home.events({
  'click #selectProducts': function(e){
    return PUB.page('/categories/all');
  }
})