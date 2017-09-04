Template.shopping.helpers({
  lists: function(){
    var limit = Router.current().params.query.limit || 10;
    limit = Number(limit);
    return Shopping.find({user_id: Meteor.userId()},{limit: limit,sort:{createdAt:-1}}).fetch();
  },
  getTotalPrice: function(){
    return this.product_price * this.product_num;
  }
});


Template.shopping.events({
  'click .remove-product': function(e){
    var _id = e.currentTarget.id;
    Shopping.remove({_id: _id});
  },
  // 结算
  'click #createOrder': function(e){
    return PUB.page('/orders/new');
  }
})