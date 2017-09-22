// PUB 公共方法
PUB = {
  // 页面切换方法
  page: function(page,scrollContainer) {
    $.hideLoading();
    $.closeModal();
    var scrollContainer = scrollContainer || '#container';
    var history_view = Session.get('history_view') || [];
    var view = Router.current().originalUrl;
    var scrollTop = $(scrollContainer).scrollTop();
    if(!view){
      return history.go(-1);
    }
    history_view.push({
      view: view,
      scrollTop: scrollTop,
      scrollContainer: scrollContainer
    });
    Session.set('history_view', history_view);
    return Router.go(page);
  },
  // 页面切换 ， 返回（配合PUB.page 使用)
  back: function(){
    $.hideLoading();
    $.closeModal();
    var history_view = Session.get('history_view');
    if (history_view) {
      var view = history_view[history_view.length - 1].view;
      var scrollTop = history_view[history_view.length - 1].scrollTop;
      var scrollContainer = history_view[history_view.length - 1].scrollContainer;
      history_view.pop();
      Session.set('history_view',history_view);
      window.setTimeout(function(){
        $(scrollContainer).scrollTop(scrollTop);
      },100);
      return Router.go(view);
    } else {
      return history.go(-1);
    }
  }
}


// cookie 相关设置
window.setCookie = function(c_name, value,expiredays){
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie=c_name + "=" +escape(value) + ((expiredays==null) ? "":";expires="+exdate.toGMTString());
}

window.getCookie = function(c_name){
  if(document.cookie.length > 0){
    var c_start=document.cookie.indexOf(c_name + "=");
    if(c_start != -1){
      c_start = c_start + c_name.length+1;
      var c_end = document.cookie.indexOf(";",c_start);
      if(c_end == -1){
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return "";
}