Template.createOrder.helpers({
  shoppings: function(){
    return Shopping.find({}).fetch();
  },
  getProductTotalPrice: function(){
    return this.product_price * this.product_num
  },
  getTotalPrice: function(){
    var price = 0;
    Shopping.find({}).forEach(function(item){
      price += item.product_num * item.product_price;
    });
    return price.toFixed(2);
  }
})