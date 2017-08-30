Template.home.onRendered(function(){
  Meteor.subscribe('products_by_seller','RTsZ64Cc8iyoc4BmW', 100);
});

Template.home.helpers({
  products: function(){
    return Products.find({}).fetch();
  }
});