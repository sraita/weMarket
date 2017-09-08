Template.addrList.helpers({
  lists: function(){
    return Contact.find({user_id: Meteor.userId()},{sort:{createdAt: -1}}).fetch();
  }
})