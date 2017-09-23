window.changePrice = function (type, shopping_id) {
  var qty = Number($('#goods_number').val()) || 1;
  var sale_price = parseFloat($('#salePrice').data('price'));
  var stock = parseInt($('#productStock').data('stock')); // 库存
  if(shopping_id){
    qty = Number($('#goods_number_'+shopping_id).val()) || 1;
    sale_price = parseFloat($('#salePrice_'+shopping_id).data('price'));
    stock = parseInt($('#productStock_'+shopping_id).data('stock')); // 库存
  }
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
  if(qty >= stock){
    qty = stock;
  }
  if (!/^[0-9]*$/.test(qty)) {
    qty = 1;
  }
  var totalPrice = parseFloat(qty * sale_price);
  if(shopping_id){
    $('#goods_number_'+shopping_id).val(qty);
    // 需要更新相应的Shopping表
    Shopping.update({_id: shopping_id},{
      $set:{
        'product_num': qty,
        'product_total_price': totalPrice
      }
    },function(err){
      if(err){
        console.log(err);
      }
    })
  } else {
    $('#goods_number').val(qty);
    // 同时增减相应的总价
    $('#totalSalePrice').html('￥ '+totalPrice);
  }
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
  console.log(this.data)
  Session.set('mainImage',this.data.mainImage);
  Session.set("DocumentTitle",'微商传播机-'+this.data.name);
  Session.set('productContent', this.data);

  Meteor.subscribe('shopping-by-product-id', Router.current().params._id);
  // Meteor.subscribe('userDistributorProductInfo', Router.current().params._id);
  var shopId = localStorage.getItem('shopId') || Router.current.params.query.s;

  shareUrl = 'http://market.raidcdn.cn/product/' + Router.current().params._id;
  if(shopId){
    shareUrl = shareUrl + '?s='+shopId;
    localStorage.setItem('shopId',shopId);
  }
  console.log(shareUrl);
  calcWeChatSignature(shareUrl);
});

Template.product.helpers({
  isInDistributo: function(){
    if(DistributorProducts.find({product_id: Router.current().params._id, distributor_id: Meteor.userId()}).count() > 0){
      return true;
    }
    return false;
  }
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
      product_price: this.sale_price,// 销售单价
      product_total_price: parseFloat($('#totalSalePrice').val()),
      profit_price: this.profit_price, // 分成佣金
      user_id: user._id,
      user_name: '',
      user_icon:'',
      stock: this.number, // 库存
      seller_icon: this.seller_icon,
      seller_id: this.seller_id,
      seller_name: this.seller_name,
      createdAt: new Date()
    }

    // 如果不是分销商
    if(!isDistributor()){
      obj.shopId = localStorage.getItem('shopId');
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
    var product_id = Router.current().params._id;
    product.product_id = product_id;
    product._id = new Mongo.ObjectID()._str;
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
  },
  // 分享商品
  'click #shareTheProduct': function(e){
    $.toast('点击右上角分享');
  }
});