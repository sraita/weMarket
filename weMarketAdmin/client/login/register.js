Template.register.events({
  // 注册成为商家
  'click #register': function(e){
    var account = $('#account').val(),
        pass    = $('#pass').val(),
        passConfirm = $('#pass-confirm').val();
    if(!account){
      return alert('请输入账户');
    }
    if(!pass || !passConfirm){
      return alert('请完整填写密码信息');
    }
    if(pass !== passConfirm){
      return alert('两次输入密码不一致');
    }

    // 注册用户
    Accounts.createUser({
      username: account,
      password: pass,
      profile:{
        role:['seller']
      }
    },function(error){
      if(error){
        console.log(error);
        return alert('创建失败，请重试');
      }
      return Router.go('/')
    });
  }
})