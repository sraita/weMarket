Template.categoriesList.helpers({
  lists: function(){
    return Categories.find({seller_id: Meteor.userId()}).fetch();
  }
})

Template.categoriesList.events({
  'click #add': function(e){
    var user, name, sortIndex, desc;

    name = $('#name').val();
    sortIndex = Number($('#sortIndex').val());
    desc = $('#desc').val();
    if(!name || !sortIndex || !desc){
      return alert('请完整填写表单！');
    }
    user = Meteor.user();
    Categories.insert({
      name: name,
      sortIndex: sortIndex,
      desc: desc,

      seller_id: Meteor.userId(), // 商家 ID
      seller_name: (user.profile && user.profile.name)?user.profile.name : user.username, // 商家名称
      seller_icon: (user.profile && user.profile.icon)?user.profile.icon : '' // 商家头像
    },function(err,_id){
      if(err){
        console.log(err);
        return alert('请重试！');
      }
      $('#name').val('');
      $('#sortIndex').val('');
      $('#desc').val('');
      $('#addCatalogues').modal('hide');
      return alert('添加成功');
    });
  },
  'click .delCatalogues': function(e){
    var _id = e.currentTarget.id;
    Categories.remove({_id,_id}, function(err){
      if(err){
        console.log(err);
        return alert('删除失败!');
      }
      return alert('删除成功');
    })
  }
})