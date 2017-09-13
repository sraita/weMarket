Template.orders.onRendered(function(){
  Session.set('orders-tab-active','all');
});
Template.orders.helpers({
  lists: function(){
    var status = Session.get('orders-tab-active');
    if(status == 'all'){
      return Orders.find({user_id: Meteor.userId()},{sort:{created:-1}}).fetch()
    } else {
      status = Number(status);
      return Orders.find({user_id: Meteor.userId(),status: status},{sort:{created:-1}}).fetch()
    }
  },
  product: function(){
    return this.products[0];
  },
  getTabActive: function(){
    return Session.get('orders-tab-active');
  },
  getOrderStatus: function(){
    // 未支付1 | 待发货2 | 已发货3 | 已收货4 | 已完成5 | 已取消0
    switch(this.status){
      case 1:
        return '未支付';
        break;
      case 2:
        return '待发货';
        break;
      case 3:
        return '已发货';
        break;
      case 4:
        return '已收货';
        break;
      case 5:
        return '已完成';
        break;
      case 0:
        return '已取消';
        break;
      default:
        return '未支付';
    }
  }
});

Template.orders.events({
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