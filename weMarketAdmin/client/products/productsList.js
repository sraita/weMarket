Template.productsList.onRendered(function(){
  var category_id = Router.current().params.category_id;
  console.log(category_id)
  Meteor.subscribe('products_by_category',Meteor.userId(),category_id,20,0);
});

Template.productsList.helpers({
  categories: function(){
    return Categories.find({seller_id: Meteor.userId()}).fetch();
  },
  products: function(){
    var category_id = Router.current().params.category_id;
    if(category_id == 'all'){
      return Products.find({seller_id: Meteor.userId()},{sort:{createdAt:-1}}).fetch();
    }
    return Products.find({seller_id: Meteor.userId(),category_id: category_id},{sort:{createdAt:-1}}).fetch();
  },
  getDefaultProfitPrice: function(profit_price, sale_price){
    if(profit_price){
      return profit_price;
    }
    var user = Meteor.user();
    var profit = user.profile.profit || 0;
    return parseFloat(sale_price * profit / 1000).toFixed(2);
  }
});

Template.productsList.events({
  'click .categoriy_item': function(e){
    var category_id = e.currentTarget.id;
    Meteor.subscribe('products_by_category',Meteor.userId(),category_id,20,0);
    Router.go('/products/list/'+category_id);
  },
  // 删除
  'click .delProduct': function(e){
    var _id = e.currentTarget.id;
    var r = confirm('要删除吗？');
    if(r){
      Products.remove({_id: _id},function(err,_id){
        if(err){
          console.log(err);
          return alert('删除失败');
        }
        return alert('已删除');
      });
    }
  },
  // 修改
  'click .modifyProduct': function(e){
    var _id = e.currentTarget.id;
    Router.go('/products/new?t=modify&id='+_id);
  }
})