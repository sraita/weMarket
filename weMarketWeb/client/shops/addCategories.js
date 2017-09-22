Template.addCategories.helpers({
  categories: function(){
    return Categories.find({}).fetch();
  },
  isSelected: function(id){
    var categories = [];
    var user = Meteor.user()
    if(user && user.profile && user.profile.categories){
      categories = user.profile.categories;
    }
    if(categories.indexOf(id) > -1){
      return 'selected'
    }
    return ''
  }
});

Template.addCategories.events({
  'click #selectAll': function(e){
    if(e.currentTarget.checked){
      $('.categoriesItem').addClass('selected');
    } else {
      $('.categoriesItem').removeClass('selected');
    }
  },
  'click .categoriesItem': function(e){
    if($(e.currentTarget).hasClass('selected')){
      $(e.currentTarget).removeClass('selected');
    } else {
      $(e.currentTarget).addClass('selected');
    }
  },
  // 存储我的商品
  'click #confirm': function(){
    var categories = [];
    $('.categoriesItem').each(function(item){
      if($(this).hasClass('selected')){
        categories.push($(this).attr('id'));
      }
    });
    console.log(categories);
    // update user categories
    $.showLoading('处理中')
    Meteor.users.update({_id: Meteor.userId()},{
      $set:{
        'profile.categories':categories
      }
    },function(error, result){
      $.hideLoading();
      if(error){
        console.log(error);
        return $.toast('请重试','cancel');
      }
      $.toast('已添加');
      Meteor.setTimeout(function(){
        PUB.back();
      },500)
    });
  }

})