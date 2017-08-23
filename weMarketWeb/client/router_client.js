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