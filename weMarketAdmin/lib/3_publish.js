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


  // 发布商品， 按商家和分类发布
  Meteor.publish('products_by_category', function(seller_id, category_id, limit,skip){
    var limit = limit || 20;
    var skip = skip || 0;
    if(!seller_id || !category_id){
      return this.ready();
    }
    if(category_id === "all"){
      return Products.find({seller_id: seller_id},{limit: limit, skip: skip,sort:{createdAt:-1}});
    } 
    return Products.find({seller_id: seller_id, category_id: category_id},{limit: limit, skip: skip,sort:{createdAt:-1}});
  });

  // 发布商品，按照商品ID发布
  Meteor.publish('product-by-id',function(_id){
    if(!this.userId || !_id){
      return this.ready();
    }
    return Products.find({_id: _id});
  });

  // 发布订单信息， 按照用户 和 状态发布
  Meteor.publish('user_orders', function(status, limit){
    if(!this.userId || !status ){
      return this.ready();
    }
    var limit = limit || 10;
    return Orders.find({user_id: this.userId, status: status},{limit: limit});
  });

  // 发布订单信息， 按照商家 和 状态发布
  Meteor.publish('seller_orders', function(seller_id,status, limit,skip){
    if(!seller_id || !status){
      return this.ready();
    }
    var limit = limit || 20;
    var skip = skip || 0;
    if(status == 'all'){
      console.log(Orders.find({seller_id: seller_id},{limit: limit,skip: skip}).count())
      return Orders.find({seller_id: seller_id},{limit: limit,skip: skip});
    } else {
       status = parseInt(status)
      return Orders.find({seller_id: seller_id, status: status},{limit: limit,skip: skip});
    }
  });

  // 发布： 按商品id, 和 user_id
  Meteor.publish('shopping-by-product-id', function(product_id){
    if(!this.userId || !product_id){
      return this.ready();
    }
    return Shopping.find({user_id: this.userId, product_id: product_id});
  });
  // 发布： 我的购物车
  Meteor.publish('user_shopping', function(limit){
    if(!this.userId){
      return this.ready();
    }
    var limit = limit || 10;
    return Shopping.find({user_id: this.userId,},{limit: limit,sort:{createdAt:-1}})
  });

  // 发布订单信息
  Meteor.publish('orderInfo', function(_id){
    if(!this.userId || !_id){
      return this.ready();
    }
    return Orders.find({_id: _id});
  });

  // 发布用户的订单列表
  Meteor.publish('user-orders', function(){
    if(!this.userId){
      return this.ready();
    }
    return Orders.find({user_id: this.userId});
  });

  // 发布用户收货地址列表
  Meteor.publish('contact_list', function(){
    if(!this.userId){
      return this.ready();
    }
    return Contact.find({user_id: this.userId},{sort:{createdAt: -1}});
  });

  Meteor.publish('contactInfo', function(_id){
    if(!this.userId || !_id){
      return this.ready();
    }
    return Contact.find({_id: _id});
  })
}
