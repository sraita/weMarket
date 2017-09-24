
Meteor.methods({
  'getOrderNumber': function(){
    var now = new Date();
    var today = new Date();
    today.setUTCHours(0,0,0,0);
    var addZero = function(value){
      if(value < 10){
        return '0'+value;
      }
      return ''+value;
    }
    var orderCountToday = Orders.find({createdAt: {$gte: today}}).count();

    orderCountToday += 1;
    var orderNumber = now.getFullYear() + addZero(now.getUTCMonth() + 1) + addZero(now.getUTCDate()) + addZero(now.getUTCHours()) + ( "0000000000000000" + orderCountToday ).substr( -6 );
    return orderNumber;
  },
  'updateUserRole': function(userId, role){
    Meteor.users.update({_id: userId},{
      $set:{'profile.role': role}
    });

    // 创建相应的店铺
    var user = Meteor.users.findOne({_id: userId});
    var shop = Shops.findOne({_id: userId});
    console.log(JSON.stringify(user));
    var categories = [];
    if(!shop){
      var categories = [];
      Categories.find({}).forEach(function(item){
        categories.push(item._id);
      });
     return Shops.insert({
        _id: userId,
        icon: (user.profile && user.profile.icon)?user.profile.icon :'/img/userPicture.png',
        name: (user.profile && user.profile.nickname)?user.profile.nickname + '的店铺':'',
        categories: categories
      });
    } else {
      return true;
    }
  }
});