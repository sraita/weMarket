Template.saleOrders.onRendered(function(){
  Session.set('orders-tab-active','all');
});
Template.saleOrders.helpers({
  lists: function(){
    var status = Session.get('orders-tab-active');
    if(status == 'all'){
      return SalesOrders.find({distributor_id: Meteor.userId()},{sort:{created:-1}}).fetch()
    } else {
      status = Number(status);
      return SalesOrders.find({distributor_id: Meteor.userId(),status: status},{sort:{created:-1}}).fetch()
    }
  },
  product: function(){
    return this.products[0];
  },
  getTabActive: function(){
    return Session.get('orders-tab-active');
  },
  getOrderStatus: function(){
    if(this.status){
      return '已完成';
    } else {
      return '进行中';
    }
  }
});

Template.saleOrders.events({
  'click .orderItem': function(e){
    var _id = e.currentTarget.id;
    return PUB.page('/orders/info/'+_id);
  },
  'click .weui-navbar__item': function(e){
    var status = e.currentTarget.id;
    $('.weui-navbar__item').removeClass('weui-bar__item--on');
    $(e.currentTarget).addClass('weui-bar__item--on');
    Session.set('orders-tab-active',status);
  }
})