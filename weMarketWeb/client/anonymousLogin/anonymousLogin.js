if(Meteor.isClient){
  window.anonymousLogin = function(){
    uuid = localStorage.getItem('user-uuid')
    if(uuid){
      Meteor.loginWithPassword(uuid, '123456', function(error){
        if(error){
          console.log(error)
        }
      });
    } else {
      var uuid = Meteor.uuid();
      Accounts.createUser({
        username: uuid,
        password: '123456',
        'profile':{
          name:'匿名',
          icon:'/img/userPicture.png',
          anonymous: true
        }
      },function(error){
        console.log('Registration Error is '+JSON.stringify(error));
        if(!error){
          localStorage.setItem('user-uuid',uuid);
          Meteor.loginWithPassword(uuid, '123456', function(error){
            if(error){
              console.log(error)
            }
          });
        }
      });
    }
  }
}