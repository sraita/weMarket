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
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  }
});