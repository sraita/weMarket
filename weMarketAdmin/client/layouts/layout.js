Template.layout.helpers({
  userInfo: function(){
    return Meteor.user()
  }
});

Template.layout.events({
  'click #quitAdmin': function(e){
    return Meteor.logout();
  }
})