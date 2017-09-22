Template.categoriesList.helpers({
  lists: function(){
    return Categories.find({seller_id: Meteor.userId()}).fetch();
  },
  categoryInfo: function(){
    return Session.get('categoryInfo');
  },
  getProfit: function(profit){
    if(profit){
      return profit;
    }
    var user = Meteor.user();
    return user.profile.profit || 0;
  }
})

Template.categoriesList.events({
  'click #addCategory': function(e){
    Session.set('categoryInfo',null);
    $('#addCatalogues').modal('show');
  },
  'click #add': function(e){
    var user, name, sortIndex, desc,profit;

    name = $('#name').val();
    sortIndex = Number($('#sortIndex').val());
    desc = $('#desc').val();
    profit = Number($('#profit').val());

    if(!name || !sortIndex || !desc || !profit){
      return alert('请完整填写表单！');
    }
    user = Meteor.user();

    var callback = function(err,result){
      if(err){
        console.log(err);
        return alert('请重试！');
      }
      $('#name').val('');
      $('#sortIndex').val('');
      $('#desc').val('');
      $('#profit').val('');
      $('#addCatalogues').modal('hide');
      return alert('已完成');
    };

    if(Session.get('categoryInfo')){
      Categories.update({
        _id: Session.get('categoryInfo')._id
      },{
        $set:{
          name: name,
          sortIndex: sortIndex,
          desc: desc,
          profit: profit
        }
      },callback);
    } else {
      Categories.insert({
        name: name,
        sortIndex: sortIndex,
        desc: desc,

        seller_id: Meteor.userId(), // 商家 ID
        seller_name: (user.profile && user.profile.name)?user.profile.name : user.username, // 商家名称
        seller_icon: (user.profile && user.profile.icon)?user.profile.icon : '' // 商家头像
      },callback);
    }
  },
  'click .modifyCatalogues':function(e){
    var _id = e.currentTarget.id;
    var categoryInfo = Categories.findOne({_id: _id});
    Session.set('categoryInfo',categoryInfo);
    $('#addCatalogues').modal('show');
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