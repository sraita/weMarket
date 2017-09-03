var searchProduct = function(text){
  console.log(text);
  console.log('searching ...');
  Session.set('showSearchStatus',false);
  ProductsSearch.search(text);
};

Template.search.onRendered(function(){
  Session.set('showSearchStatus', true);
});

Template.search.helpers({
  history: function(){
    return Session.get('searchHistory');
  },
  showSearchStatus: function(){
    return Session.get('showSearchStatus');
  },
  searchLoading: function(){
    return Session.get('searchLoading');
  },
  getProducts: function(){
    var productsSearchData = ProductsSearch.getData({
      transform: function(matchText, regExp) {
        return matchText;
      },
      sort: {createdAt: -1}
    });
    if(productsSearchData.length == 0){
      Meteor.setTimeout (function(){
        Session.set("searchLoading", false);
      },500);
    } else {
      Session.set("searchLoading", false);
    }
    return productsSearchData;
  },
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
  },
  'focus .search-input': function(){
    Session.set('showSearchStatus', true);
  }
})
Template.search.events({
  // 清除搜索记录
  'click .clear-search': function(){
    Session.set('searchHistory',null);
  },
  'click .search-history-item': function(e){
    var text = $(e.currentTarget).text();
    $('.search-input').val(text);
    searchProduct(text);
  },
  'click .close-search': function(){
    return PUB.back();
  }
})