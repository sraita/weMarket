if(Meteor.isClient){
  Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
  });
  Router.onBeforeAction(function(){
    // do some login checks or other custom logic
    if(!Meteor.userId()){
      console.log('user not login or user is not admin')
      Router.go('/login');
    }
    this.next();
  },{except:['register','forgotpass','oauth/wechat']});

  // 登录Admin 
  Router.route('/login',{
    name: 'login',
    layoutTemplate: 'loginLayout'
  });

  Router.route('/register',{
    name: 'register',
    layoutTemplate: 'loginLayout'
  });

  Router.route('/', {
    name: 'home',
    waitOn: function(){
      return  [
        // Meteor.subscribe('admin_home_counts',Meteor.userId()),
        Meteor.subscribe('seller_orders', Meteor.userId(),'2', 5,0)
      ];
    }
  });

  // 商品分类管理
  Router.route('/categories',{
    name: "categoriesList",
    waitOn: function(){
      return  Meteor.subscribe('categories_by_seller',Meteor.userId());
    }
  });

  // 商品列表
  Router.route('/products/list/:category_id',{
    name: 'productsList',
    waitOn: function(){
      return  Meteor.subscribe('categories_by_seller',Meteor.userId());
    }
  });

  // 新增商品
  Router.route('/products/new',{
    name: 'productsAdd',
    waitOn: function(){
      return  Meteor.subscribe('categories_by_seller',Meteor.userId());
    }
  });

  // 商城设置
  Router.route('/settings',{
    name: 'settings'
  });

  // 商家查看订单
  Router.route('/orders/:_status',{
    name: 'orders',
    waitOn: function(){
      var status = this.params._status;
      var limit = this.params.query.limit || 20;
      limit = parseInt(limit)
      var page = this.params.query.page || 1;
      page = parseInt(page - 1);
      var skip = parseInt(page * limit);
      return Meteor.subscribe('seller_orders', Meteor.userId(),status, limit,skip);
    }
  });
}