Template.headSearchLayout.events({
  'click .head-search': function(e){
    e.preventDefault();
    PUB.page('/search');
  }
})