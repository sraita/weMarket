Router.configure({
  loadingTemplate: 'loading'
});

Router.onBeforeAction(function () {
  if (!Meteor.userId() && Session.equals('pageNeedLogin',true)) {
    Router.go('login');
  }
  this.next();
},{except:['register','forgotpass']});


Router.route('/',{
  name: 'home',
  layoutTemplate: 'headFootLayout'
});

// 分类
Router.route('/categories',{
  name: 'categories',
  layoutTemplate: 'headFootLayout'
});

// 购物车
Router.route('/shopping',{
  name: 'shopping',
  layoutTemplate: 'headFootLayout'
});

// 我
Router.route('/me',{
  name: 'me',
  layoutTemplate: 'headFootLayout'
});