Template.footer.helpers({
  isCurr: function(id){
    if(Router.current().route.getName() == id){
      return 'weui-bar__item--on'
    } else {
      return '';
    }
  }
});