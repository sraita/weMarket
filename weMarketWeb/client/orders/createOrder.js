Template.createOrder.onRendered(function(){
  Meteor.subscribe('contact_list', function(){
    var contact = Contact.findOne({user_id: Meteor.userId()},{sort:{createdAt:-1}});
    Session.set('selectedAddr', contact);
  });
});

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
  },
  contact: function(){
    return Session.get('selectedAddr');
  },
  contacts: function(){
    return Contact.find({user_id: Meteor.userId()},{sort:{createdAt:-1}}).fetch();
  },
  selectedAddr: function(_id){
    if(Session.get('selectedAddr') && Session.get('selectedAddr')._id === _id){
      return true;
    } 
    return false;
  }
});

Template.createOrder.events({
  'click #user_addr': function(e){
    return $('#selectAddr').popup();
  },
  'click .selectAddrItem': function(e){
    // console.log(this);
    Session.set('selectedAddr',this);
  },
  'click .selectAddrBtn': function(e){
    return $.closePopup();
  },
  'click #createOrder': function(e){
    Meteor.call('getOrderNumber', function(err, result){
      if(err){
        console.log(err);
        return $.toast('请重试！','cancel');
      }
      var order_no = result;
      var user = Meteor.user();
      var addr = Session.get('selectedAddr');
      var obj = {
        user_id: user._id,
        user_name: (user.profile && user.profile.name)? user.profile.name : user.username,
        user_icon: (user.profile && user.profile.icon)? user.profile.icon:'/img/userPicture.png',

        user_addr: addr,

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