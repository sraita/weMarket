Template.home.onRendered(function(){
  Meteor.subscribe('products_by_seller','ESnXKteEQCsMX9y9g', 100);
});

Template.home.helpers({
  products: function(){
    return Products.find({}).fetch();
  }
});