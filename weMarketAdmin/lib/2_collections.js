//  数据库定义
function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}
// 产品分类表
Categories = new Mongo.Collection('categories');
// 产品表
Products = new Mongo.Collection('products');
// 订单表
Orders = new Mongo.Collection('orders');
// 用户购物车
Shopping = new Mongo.Collection('shopping');

// 微信token
AccessToken = new Mongo.Collection('access_token');

// 用户商品寄送地址信息
Contact = new Mongo.Collection('contact');

// 分销商销售情况统计
SalesOrders = new Mongo.Collection('salesOrders');

// 分销商选中的分销商品列表
DistributorProducts = new Mongo.Collection('distributorProducts');


// shops 存储店铺表
Shops = new Mongo.Collection('shops');

if(Meteor.isServer){
  // search products
  SearchSource.defineSource('products', function(searchText, options) {
    var options = {sort: {createdAt: -1}};

    if(searchText) {
      var regExp = buildRegExp(searchText);
      var selector = {name: regExp};
      return Products.find(selector, options).fetch();
    } else {
      return Products.find({}, options).fetch();
    }
  });
}

if(Meteor.isClient){
  ProductsSearch = new SearchSource('products', ['name'], {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  });
}
