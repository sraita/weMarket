Template.addrNew.onRendered(function(){
  var _id = Router.current().params.query.id
  if(_id){
    Meteor.subscribe('contactInfo', _id);
  }
});

Template.addrNew.helpers({
  data: function(){
    var _id = Router.current().params.query.id
    if(_id){
      return Contact.findOne({_id: _id});
    }
    return {};
  }
});

Template.addrNew.events({
  'click #save': function(e){
    var user = Meteor.user();
    var obj = {
      "user_id":user._id,
      "user_name":(user.profile && user.profile.name)? user.profile.name: user.username,
      "user_icon":(user.profile && user.profile.icon)? user.profile.icon: '/img/userPicture.png',

      "contact_name":$('#contact_name').val(),
      "contact_mobile":Number($('#contact_mobile').val()),
      "contact_city":$('#contact_city').val(),
      "contact_street":$('#contact_street').val(),
      "postal_code":Number($('#postal_code').val()),
      "createdAt": new Date()
    };
    if(!obj.contact_name){
      return $.toast('请填写联系人','cancel');
    }
    if(!obj.contact_mobile){
      return $.toast('请填写手机号','cancel');
    }
    if(!obj.contact_city){
      return $.toast('请选择地区','cancel');
    }
    if(!obj.postal_code){
      return $.toast('请填邮政编码','cancel');
    }
    if(!obj.contact_street){
      return $.toast('请填写街道信息','cancel');
    }
    console.log(obj);
    $.showLoading('处理中');
    var callback = function(err, result){
      $.hideLoading();
      if(err){
        console.log(err);
        return $.toast('请重试','cancel');
      }
      $.toast('已保存');
      return PUB.back();
    };
    var _id = Router.current().params.query.id
    if(_id){
      Contact.update({_id: _id},{$set:obj},callback);
    } else {
      Contact.insert(obj, callback);
    }
  }
})