Template.login.events({
  'click #loginin':function(e){
    e.preventDefault();
    var account = $('#account').val(),
        pass = $('#pass').val();

    if(!account){
      $("#account").val("").focus();
    }
    if(!pass){
      $("#pass").val("").focus();
    }
    $("#loginin").val('登录中...');
    Meteor.loginWithPassword(account,pass,function(err,res){
      if(err){
        return alert('登录失败');
      }
      Router.go('/');
    });
  }
})