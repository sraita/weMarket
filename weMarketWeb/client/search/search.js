var searchProduct = function(text){
  console.log(text);
  console.log('searching ...');
};

Template.search.helpers({
  history: function(){
    return Session.get('searchHistory');
  }
});


Template.searchHeader.events({
  // 搜索
  'click .search-btn': function(e){
    var text = $('.search-input').val();
    if(!text || text == '' || text.replace(/\s/gim,"").length == 0){
      return $('.search-input').focus();
    }
    var history = Session.get('searchHistory') || [];
    if(history.indexOf(text) < 0){
      history.push(text);
      Session.set('searchHistory',history);
    }
    searchProduct(text);
  }
})
Template.search.events({
  // 清除搜索记录
  'click .clear-search': function(){
    Session.set('searchHistory',null);
  },
  'click .search-history-item': function(e){
    var text = $(e.currentTarget).text();
    searchProduct(text);
  },
  'click .close-search': function(){
    return PUB.back();
  }
})