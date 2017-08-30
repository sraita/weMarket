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

Template.product.events({

});