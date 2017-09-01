changePrice = function (type) {
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
});

Template.product.helpers({

});

Template.product.events({
  // 添加到购物车
  'click .addToCart': function(){
    $("#addToCart").popup();
  }
});