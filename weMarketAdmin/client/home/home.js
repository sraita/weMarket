Template.home.helpers({
  orderLists: function(){
    return Orders.find({seller_id: Meteor.userId(), status:2},{limit:5});
  }
})