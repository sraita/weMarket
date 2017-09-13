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
    var seller_id = Router.current().params.query.s || localStorage.getItem('seller_id') || 'RTsZ64Cc8iyoc4BmW';
    if(Object.keys(Router.current().params.query).length === 0){
      page = page + '?s='+seller_id 
    } else {
      page = page +'&s='+seller_id;
    }
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
    } 
    return Router.go('/');
  }
}