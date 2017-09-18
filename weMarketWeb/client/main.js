Template.registerHelper('seller_id', function(){
  return Router.current().params.query.s || localStorage.getItem('seller_id') || 'JWyJfabzzpq9grw4Q';
});

// 是否是分销商
Template.registerHelper('isDistributor', function(){
  return false;
  var user = Meteor.user();
  if(user && user.profile && user.profile.role && user.profile.role.indexOf('distributor') >= 0){
    return true;
  } else {
    return false;
  }
});


if (Meteor.isClient) {
  Session.set("DocumentTitle",'微商传播机');
  Deps.autorun(function(){
    document.title = Session.get("DocumentTitle");
  });
}