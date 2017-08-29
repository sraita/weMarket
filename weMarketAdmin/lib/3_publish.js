if(Meteor.isServer){
  // 数据发布
  
  // 发布分类信息, 按照商家发布
  Meteor.publish("categories_by_seller", function (seller_id) {
    return Categories.find({seller_id: seller_id});
  });


  // 发布商品， 按商家发布
  Meteor.publish("products_by_seller", function(seller_id, limit){
    var limit = limit || 10;
    return Products.find({seller_id: seller_id},{limit: limit});
  });


  // 发布订单信息， 按照用户 和 状态发布
  Meteor.publish('user_orders', function(status, limit){
    if(!this.userId || !status ){
      return this.ready();
    }
    var limit = limit || 10;
    return Orders.find({user_id: this.userId, status: status},{limit: limit});
  });
}
