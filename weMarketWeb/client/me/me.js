Template.me.onRendered(function(){
  Meteor.subscribe('user-orders');
});

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
  },
  orderStatus1Count: function(){
    return Orders.find({user_id: Meteor.userId(), status:1}).count();
  },
  orderStatus3Count: function(){
    return Orders.find({user_id: Meteor.userId(), status:3}).count();
  },
  orderStatus5Count: function(){
    return Orders.find({user_id: Meteor.userId(), status:5}).count();
  }
});

Template.me.events({
  'click .goOrderList': function(){
    return PUB.page('/orders/list')
  },
  'click .goAddrList': function(){
    return PUB.page('/addr/list');
  }
})