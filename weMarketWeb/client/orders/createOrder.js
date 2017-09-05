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
});

Template.createOrder.events({
  'click #createOrder': function(e){
    Meteor.call('getOrderNumber', function(err, result){
      if(err){
        console.log(err);
        return $.toast('请重试！','cancel');
      }
      var order_no = result;
      var user = Meteor.user();

      var obj = {
        user_id: user._id,
        user_name: (user.profile && user.profile.name)? user.profile.name : user.username,
        user_icon: (user.profile && user.profile.icon)? user.profile.icon:'/img/userPicture.png',

        user_addr:$('#user_addr option:selected').text(),

        seller_id: Router.current().params.query.s || 'RTsZ64Cc8iyoc4BmW',
        products: [],

        order_no: order_no,
        status: 1,
        total_price: $('#total_price').val(),
        total_num: Number($('#total_num').val()),
        createdAt: new Date()
      }
      var shoppingIds = [];
      Shopping.find({}).forEach(function(item){
        obj.products.push(item);
        shoppingIds.push(item._id);
      });

      Orders.insert(obj, function(err, _id){
        if(err){
          console.log(err);
          return $.toast('订单创建失败','cancel');
        }
        console.log(_id);
        Meteor.setTimeout(function(){
          shoppingIds.forEach(function(id){
            Shopping.remove({_id: id});
          });
        });

        PUB.page('/orders/success/'+_id);
      });

    });
  } 
});