Template.productsList.helpers({
  categories: function(){
    return Categories.find({seller_id: Meteor.userId()}).fetch();
  }
});