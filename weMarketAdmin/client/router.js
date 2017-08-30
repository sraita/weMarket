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
  },{except:['register','forgotpass']});

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
    name: 'categoriesList',
    waitOn: function(){
      return  Meteor.subscribe('categories_by_seller',Meteor.userId());
    }
  });

  // 商品分类管理
  // Router.route('/categoriesList',{
  //   name: "categoriesList",

  // });

  // 商品列表
  Router.route('/products/list',{
    name: 'productsList',
    waitOn: function(){
      return  Meteor.subscribe('categories_by_seller',Meteor.userId());
    }
  });

  // 新增商品
  Router.route('/products/add',{
    name: 'productsAdd',
    waitOn: function(){
      return  Meteor.subscribe('categories_by_seller',Meteor.userId());
    }
  });
}