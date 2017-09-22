Template.footer.helpers({
  isCurr: function(id){
    if(Router.current().route.getName() == id){
      return 'weui-bar__item--on'
    } else {
      return '';
    }
  },
  shareProductId: function(){
    return Session.get('shareProductId');
  },
  userId: function(){
    return Meteor.userId()
  },
  shopId: function(){
    return localStorage.getItem('shopId')
  }
});