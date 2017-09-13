var appid = 'wx5ca4836ebbda7287';
var app_secret = 'afd33592eb230c2f8f9936881b2383ba';
var scope = 'snsapi_userinfo';
var state = Date.now();

var redirect_uri = encodeURIComponent('market.raidcdn.cn/oauth/wexhat');
var auth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+
               '&redirect_uri='+redirect_uri+
               '&response_type=code&scope='+scope+
               '&state='+state+'#wechat_redirect';

Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.onBeforeAction(function () {
  // if (!Meteor.userId() && Session.equals('pageNeedLogin',true)) {
  //   Router.go('login');
  // }
  if(!Meteor.userId() || !localStorage.getItem('user-openid')){
    console.log('user not login');

    // 跳转到微信用户授权登录页面
    window.open(auth_url,'_self');
  }
  if(!Meteor.userId() && localStorage.getItem('user-openid')){
    loginByOpenId();
  }
  this.next();
},{except:['register','forgotpass','oauth/wechat']});


Router.route('/',{
  name: 'home',
  layoutTemplate: 'headSearchLayout'
});

// 分类
Router.route('/categories/:_id',{
  name: 'categories',
  layoutTemplate: 'headSearchLayout',
  waitOn: function(){
    var limit = this.params.query.limit || 10;
    limit = Number('limit');
    var category_id = this.params._id || 'all';
    var seller_id = Router.current().params.query.s || 'RTsZ64Cc8iyoc4BmW';
    Meteor.subscribe('categories_by_seller',seller_id);
    return Meteor.subscribe('products_by_category',seller_id,category_id, limit);
  }
});

// 购物车
Router.route('/shopping',{
  name: 'shopping',
  layoutTemplate: 'headFootLayout',
  yieldRegions: {
    'shoppingHeader': {to: 'header'}
  },
  waitOn: function(){
    var limit = this.params.query.limit || 10;
    console.log(limit)
    Meteor.subscribe('user_shopping',Number(limit));
  }
});

// 我
Router.route('/me',{
  name: 'me',
  layoutTemplate: 'footLayout'
});

// 商品详情页
Router.route('/product/:_id',{
  name: 'product',
  layoutTemplate: 'headLayout',
  yieldRegions: {
    'productHeader': {to: 'header'}
  },
  waitOn: function(){
    return Meteor.subscribe('product-by-id', this.params._id);
  },
  data: function(){
    return Products.findOne({_id: this.params._id});
  }
});

// 搜索页
Router.route('/search',{
  name: 'search',
  layoutTemplate: 'headLayout',
  yieldRegions: {
    'searchHeader': {to: 'header'}
  },

});

// 搜索结果页
Router.route('/searchReault',{
  name: 'searchReault',
  layoutTemplate: 'headLayout'
});

// 确认订单
Router.route('/orders/new',{
  name: 'createOrder',
  layoutTemplate: 'headLayout',
  yieldRegions: {
    'createOrderHeader':{ to: 'header'}
  },
  waitOn: function(){
    return Meteor.subscribe('user_shopping');
  }
});

// 订单创建成功
Router.route('/orders/success/:_id',{
  name: 'orderSuccess',
  layoutTemplate: 'headLayout',
  yieldRegions: {
    'orderSuccessHeader': {to: 'header'}
  },
  waitOn: function(){
    return Meteor.subscribe('orderInfo', this.params._id);
  },
  data: function(){
    return Orders.findOne({_id: this.params._id});
  }
});

// 订单列表
Router.route('/orders/list',{
  name: 'orders',
  layoutTemplate: 'headLayout',
  yieldRegions:{
    'ordersHeader':{ to : 'header'}
  },
  waitOn: function(){
    return Meteor.subscribe('user-orders');
  }
});


Router.route('/orders/info/:_id',{
  name: 'orderInfo',
  layoutTemplate: 'headLayout',
  yieldRegions:{
    'orderInfoHeader':{ to : 'header'}
  },
  waitOn: function(){
    return Meteor.subscribe('orderInfo',this.params._id);
  },
  data: function(){
    return Orders.findOne({_id: this.params._id});
  }
});

// 收货地址管理
Router.route('/addr/list',{
  name: 'addrList',
  layoutTemplate: 'headLayout',
  yieldRegions:{
    'addrListHeader':{ to : 'header'}
  },
  waitOn: function(){
    return Meteor.subscribe('contact_list');
  }
});

Router.route('/addr/new',{
  name: 'addrNew',
  layoutTemplate: 'headLayout',
  yieldRegions:{
    'addrNewHeader':{ to : 'header'}
  }
});