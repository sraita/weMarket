Template.shopCategories.helpers({
  categories: function(){
    return Categories.find({}).fetch();
  },
  products: function(){
    var limit = Router.current().params.query.limit || 10;
    limit = Number(limit);
    var category_id = Router.current().params._id || 'all';
    if(category_id === 'all'){
      return Products.find({},{limit: limit}).fetch();
    }
    return Products.find({category_id: category_id},{limit:limit}).fetch();
  },
  currCategory: function(_id){
    if(_id ==  Router.current().params._id ){
      return 'curr';
    }
    return '';
  }
});

Template.shopCategories.events({
  'click .category-item': function(e){
    var _id = e.currentTarget.id;
    var shopId = localStorage.getItem('shopId')
    PUB.page('/shop/c/'+shopId+'/'+_id);
  }
})