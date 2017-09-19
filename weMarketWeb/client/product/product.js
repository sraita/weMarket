window.changePrice = function (type) {
  var qty = Number($('#goods_number').val()) || 1;
  //var qty = 0;

  if (type == 1) {
    qty--;
  }
  if (type == 3) {
    qty++;
  }
  if (qty <= 0) {
    qty = 1;
  }
  if (!/^[0-9]*$/.test(qty)) {
    qty = 1;
  }
  $('#goods_number').val(qty);
}
Template.product.onRendered(function(){
  var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationType : 'custom',
      autoplay : 5000,
      loop: true,
      paginationCustomRender: function (swiper, current, total) {
        return '<span class="swiper-pagination-bullet">' + current + ' / ' + total + '</span>';
      }
  });
  console.log(this)
  Session.set('mainImage',this.mainImage);
  Meteor.subscribe('shopping-by-product-id', Router.current().params._id);
});

Template.product.helpers({

});

Template.product.events({
  // 添加到购物车Popup
  'click .addToCart': function(){
    $("#addToCart").popup();
  },
  // 添加到购物车
  'click .btn-addCart': function(){
    var shopping = Shopping.findOne({user_id: Meteor.userId(), product_id: this._id});
    console.log(shopping)
    var user = Meteor.user();
    var obj = {
      product_id: this._id,
      product_name: this.name,
      product_img: this.mainImage,
      product_num: Number($('#goods_number').val()),
      product_price: this.sale_price,
      user_id: user._id,
      user_name: '',
      user_icon:'',
      seller_icon: this.seller_icon,
      seller_id: this.seller_id,
      seller_name: this.seller_name,
      createdAt: new Date()
    }
    console.log(obj);
    $.showLoading('正在添加');
    var callback = function(err,_id){
      $.hideLoading();
      if(err){
        console.log(err);
        return $.toast('请重试','cancel');
      }
      $.closePopup();
      return $.modal({
        title: "已添加到购物车",
        text: "该商品已经添加到购物车，您现在还需要继续购物吗？",
        buttons: [
          { text: "继续购物", className: "default", onClick: function(){ $.closeModal(); }},
          { text: "马上结算", onClick: function(){
            // goTo
            return PUB.page('/shopping');
          }}
        ]
      });
    }
    if(shopping){
      obj.product_num += shopping.product_num;
      Shopping.update({_id: shopping._id},{
        $set:obj
      },callback);
    } else {
      Shopping.insert(obj, callback);
    }
  },

  // 加入到分销列表
  'click #selectToSale': function(){
    var product = Products.findOne({_id: Router.current().params._id});
    var user = Meteor.user();
    product.distributor_id = user._id;
    product.distributor_name = user.profile.name;
    product.distributor_icon = user.profile.icon;

    DistributorProducts.insert(product, function(err, result){
      if(err){
        console.log(err);
        return $.toast('请重试','cancel');
      }
      $.toast('已添加');
      Meteor.setTimeout(function(){
        return PUB.back();
      },500);
    })
  }
});