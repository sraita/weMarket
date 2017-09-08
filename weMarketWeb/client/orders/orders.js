Template.orders.helpers({
  lists: function(){
    return Orders.find({user_id: Meteor.userId()},{sort:{created:-1}}).fetch()
  },
  product: function(){
    return this.products[0];
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
        return '已完成5';
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
  }
})