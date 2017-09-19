Template.saleOrders.onRendered(function(){
  Session.set('orders-tab-active','waiting');
});
Template.saleOrders.helpers({
  lists: function(){
    var status = Session.get('orders-tab-active');
    return SalesOrders.find({distributor_id: Meteor.userId(),status: status},{sort:{created:-1}}).fetch()
  },
  // product: function(){
  //   return this.products[0];
  // },
  getTabActive: function(){
    return Session.get('orders-tab-active');
  },
  getOrderStatus: function(){
    if(this.status === 'complate'){
      return '已完成';
    } else if(this.status === 'waiting'){
      return '进行中';
    } else {
      return '失败';
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