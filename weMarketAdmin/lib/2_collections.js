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
