Template.addrList.helpers({
  lists: function(){
    return Contact.find({user_id: Meteor.userId()},{sort:{createdAt: -1}}).fetch();
  }
});

Template.addrList.events({
  'click .addrItem': function(e){
    var _id = e.currentTarget.id;
    $.actions({
      actions: [{
        text: "编辑",
        onClick: function() {
          return PUB.page('/addr/new/?id='+_id);
        }
      },{
        text: "删除",
        onClick: function() {
          var count = Contact.find({user_id: Meteor.userId()},{sort:{createdAt: -1}}).count();
          if(count < 2){
            return $.alert('请至少保留一个收货地址！');
          }
          $.showLoading('处理中');
          Contact.remove({_id: _id}, function(err, result){
            if(err){
              console.log(err);
              return $.toast('请重试！','cancel')
            }
            return $.toast('已删除');
          });
        }
      }]
    });
  }
})