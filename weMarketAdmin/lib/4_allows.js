// 创建新订单同时， 创建分销商相应佣金记录
var orderInsertHookHandle = function(doc){
  console.log(JSON.stringify(doc));
  Meteor.defer(function(){
    doc.products.forEach(function(item){
      var obj = {
        "order_no": doc.order_no, // 订单号
        "product_id": item.product_id, // 订单商品id
        "product_name": item.product_name, // 订单商品名称
        "product_img": item.product_img,
        // 商家信息
        "seller_id": item.seller_id, // 商家 ID
        "seller_name": item.seller_name, // 商家名称
        "seller_icon": item.seller_icon, // 商家头像
      
        // 分销商信息
        "shop_id": item.shopId,

        "profit_price": item.profit_price, // 分销商每销售成功一件可获利金额
        // 订单信息
        "price": item.product_price, // 订单单价
        "product_number": 1, // 订单商品数量
        "total_price": doc.total_price, // 订单总价
        "createdAt": new Date(), // 下单时间
        
        "status": 'waiting', // 状态： 'complate'(已完成) || 'waiting'(进行中) || 'failed'(用户退款)

        // 下单人信息
        "user_id": doc.user_id, // 下单人id,
        "user_name": doc.user_name, // 下单人名称
        "user_icon": doc.user_icon // 下单人ICON
      }
      SalesOrders.insert(obj);
    });
  });
}
// 更新订单的同时，更新分销商相应的佣金记录
var orderUpdateHookHandle = function(doc,fieldNames,modifier){
  console.log(JSON.stringify(doc));
  var fail_reson = '';
  var status = '';
  if(modifier.$set.status == 0){
    status = 'failed';
    fail_reson = '用户取消了订单';
  }
  if(modifier.$set.status == 5){
    status = 'complate';
    fail_reson = '';
  }
  Meteor.defer(function(){
    SalesOrders.update({order_no: doc.order_no},{
      $set:{
        'status':status,
        'fail_reson':fail_reson
      }
    },{multi: true});
  })
};

// 数据权限

// 商品分类权限， 只有商家可以修改
Categories.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.seller_id === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.seller_id === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.seller_id === userId;
  }
});

// 商品表权限， 只有商家可以修改
Products.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.seller_id === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.seller_id === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.seller_id === userId;
  }
});


// 订单表权限， 商家拥有全部权限， 用户只有insert 和 update权限
Orders.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    orderInsertHookHandle(doc);
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    // can only change your own documents
    if(fieldNames && fieldNames.indexOf('status') > -1){
      console.log(modifier.$set.status)
      orderUpdateHookHandle(doc,fieldNames,modifier);
    }
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  }
});

// 店铺信息权限， 只有店铺创建者才有相关权限
Shops.allow({
  insert: function(userId,doc){
    return userId == doc._id;
  },
  update: function(userId,doc){
    return userId == doc._id;
  },
  remove: function(userId,doc){
    return userId == doc._id;
  }
});