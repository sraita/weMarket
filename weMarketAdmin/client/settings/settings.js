Template.settings.helpers({
  profitVal: function(){
    var user = Meteor.user();
    return user.profile.profit || 0;
  }
});


Template.settings.events({
  'click #save': function(){
    var profit = parseInt($('#profit').val());
    Meteor.users.update({
      _id: Meteor.userId(),
    },{
      $set:{
        'profile.profit':profit
      }
    },function(){
      alert('已保存')
    })
  }
});