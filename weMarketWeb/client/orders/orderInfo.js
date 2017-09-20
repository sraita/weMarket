Template.orderInfo.helpers({
  getProductTotalPrice: function(){
    return (this.product_num * this.product_price).toFixed(2);
  }
});

Template.orderInfo.events({
  'click #cancelOrder': function(e){
    console.log(this._id);
    Orders.update({_id: this._id},{
      $set:{
        status: 0
      }
    },function(err, result){
      if(err){
        console.log(err);
        return $.toast('请重试','cancel');
      }
      $.toast('已取消');
      Meteor.setTimeout(function(){
        PUB.back()
      },1000);
    })
  },
  showActionBtn: function(){
    if(this.status == 1){
      return true;
    }
    return false;
  }
})