Template.layout.helpers({
  userInfo: function(){
    return Meteor.user()
  }
});

Template.layout.events({
  'click #quitAdmin': function(e){
    return Meteor.logout();
  },
  // 获取店铺地址
  'click #getMarket': function(e){
    alert('http://market.raidcdn.cn/?s='+ Meteor.userId());
  }
})