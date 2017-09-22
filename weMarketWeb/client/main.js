Template.registerHelper('seller_id', function(){
  return Router.current().params.query.s || localStorage.getItem('seller_id') || 'JWyJfabzzpq9grw4Q';
});

Template.registerHelper('shopId', function(){
  return localStorage.getItem('shopId');
});

// 是否是分销商
Template.registerHelper('isDistributor', function(){
  var user = Meteor.user();
  if(user && user.profile && user.profile.role && user.profile.role.indexOf('distributor') >= 0){
    return true;
  } else {
    return false;
  }
});

// 是否是分销商
isDistributor = function(){
  var user = Meteor.user();
  if(user && user.profile && user.profile.role && user.profile.role.indexOf('distributor') >= 0){
    return true;
  }
  return false;
}

Template.registerHelper('shareProductId', function(){
  return Session.get('shareProductId');
});

if (Meteor.isClient) {
  Session.set("DocumentTitle",'微商传播机');
  Deps.autorun(function(){
    document.title = Session.get("DocumentTitle");
  });
}