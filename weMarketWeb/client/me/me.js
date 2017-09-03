Template.me.helpers({
  user: function(){
    return Meteor.user();
  },
  userName: function(){
    var user = Meteor.user();
    return (user.profile && user.profile.name)? user.profile.name : user.username;
  },
  userIcon: function(){
    var user = Meteor.user();
    return (user.profile && user.profile.icon)? user.profile.icon : '/img/userPicture.png';
  }
})