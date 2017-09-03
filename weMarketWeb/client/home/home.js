Template.home.onRendered(function(){
  Meteor.subscribe('products_by_seller','RTsZ64Cc8iyoc4BmW', 100);
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      autoplay : 5000,
      loop: true
  });
});

Template.home.helpers({
  products: function(){
    return Products.find({}).fetch();
  }
});