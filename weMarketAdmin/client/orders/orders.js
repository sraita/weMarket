Template.orders.helpers({
  lists: function(){
    var status = Router.current().params._status;
    var limit = Router.current().params.query.limit || 20;
    limit = parseInt(limit)
    var page = Router.current().params.query.page || 1;
    page = parseInt(page - 1);
    var skip = parseInt(page * limit);
    if(status == 'all'){
      return Orders.find({seller_id: Meteor.userId()},{limit: limit,skip: skip});
    } else {
      status = parseInt(status)
      return Orders.find({seller_id: Meteor.userId(), status: status},{limit: limit,skip: skip});
    }
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
  },
  currStatus: function(status){
    if( status == Router.current().params._status){
      return 'bg-purple'
    }
    return '';
  }
});


Template.orders.events({
  // 状态筛选
  'click .changeStatus': function(e){
    var status = e.currentTarget.id;
    return Router.go('/orders/'+ status +'?limit=20&page=1');
  },
  // 下一页
  'click #nextPage': function(){
    var status = Router.current().params._status;
    var limit = Router.current().params.query.limit || 20;
    limit = parseInt(limit)
    var page = Router.current().params.query.page || 1;
    page = parseInt(page);
    page += 1
    return Router.go('/orders/'+ status +'?limit='+limit+'&page='+page);
  },
  // 上一页
  'click #prevPage': function(){
    var status = Router.current().params._status;
    var limit = Router.current().params.query.limit || 20;
    limit = parseInt(limit)
    var page = Router.current().params.query.page || 1;
    page = parseInt(page);
    if(page > 1){
      page -= 1
      return Router.go('/orders/'+ status +'?limit='+limit+'&page='+page);
    }
  }
})