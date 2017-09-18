
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
  }
});