Template.productsAdd.onRendered(function(){
  var productId = Router.current().params.query.id;
  if(productId){
    Meteor.subscribe('product-by-id',productId);
  }
});
Template.productsAdd.helpers({
  categories: function(){
    return Categories.find({seller_id: Meteor.userId()}).fetch();
  },
  images: function(){
    return Session.get('uploadedImages'); 
  },
  isModify: function(){
    var type = Router.current().params.query.t;
    if(type == 'modify'){
      return true;
    }
    return false;
  },
  product: function(){
    var _id = Router.current().params.query.id;
    return Products.findOne({_id: _id});
  },
  optionSelected: function(a,b){
    if(a == b){
      return true;
    }
    return false;
  }
});


Template.productsAdd.events({
  'click #save': function(){
    var name = $('#name').val(),
        desc = $('#desc').val(),
        unit_price = Number($('#unit_price').val()),
        sale_price = Number($('#sale_price').val()),
        number = Number($('#number').val()),
        category_id = $('#category_id option:selected').attr('id'),
        content = CKEDITOR.instances.editor.getData();
    if(!name || !desc || !unit_price || !sale_price || ! number || !category_id || ! content){
      return alert('请完整填写表单');
    }

    var user = Meteor.user();
    
    var obj = {
      name: name,
      unit_price: unit_price,
      sale_price: sale_price,
      number: number,
      mainImage: "",
      images:[],
      desc: desc,
      content: content,
      category_id: category_id,
      seller_id: user._id,
      seller_name : (user.profile && user.profile.name)?user.profile.name: user.username,
      seller_icon: (user.profile && user.profile.icon)?user.profile.icon: ""
    };

    console.log(obj);
    var type = Router.current().params.query.t;
    if(type == 'modify'){
      var productId = Router.current().params.query.id;
      Products.update({_id: productId},{$set:obj},function(err,_id){
        if(err){
          console.log('err');
          return alert('请重试');
        }
        alert('修改商品信息成功');
        return Router.go('/products/list/all');
      });
    } else {
      Products.insert(obj, function(err,_id){
        if(err){
          console.log('err');
          return alert('请重试');
        }
        alert('新增商品成功');
        return Router.go('/products/list/all');
      });
    }
  }
});

Template.productsAdd.onDestroyed(function(){
  clearPluploadSession();
})