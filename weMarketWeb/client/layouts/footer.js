Template.footer.helpers({
  isCurr: function(id){
    if(Router.current().route.getName() == id){
      return 'weui-bar__item--on'
    } else {
      return '';
    }
  },
  seller_id: function(){
    return Router.current().params.query.s || 'RTsZ64Cc8iyoc4BmW';
  }
});