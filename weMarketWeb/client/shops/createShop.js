Template.createShop.events({
  'click #createShop': function(){
    var user = Meteor.user();
    var role = user.profile.role || [];
    if(role.indexOf('distributor') < 0){
      role.push('distributor');
    }
    $.showLoading('处理中');
    Meteor.call('updateUserRole',user._id, role, function(error, result){
      $.hideLoading();
      if(error){
        console.log(error);
        return $.toast('请重试','cancel');
      }
      $.toast('已成为分销商');
      Meteor.setTimeout(function(){
        Router.go('/myShop/'+user._id);
      },1000)
    });
  }
});