Template.registerHelper('seller_id', function(){
  return Router.current().params.query.s || localStorage.getItem('seller_id') || 'RTsZ64Cc8iyoc4BmW';
});