// Deps.autorun(function(){
//   if(Meteor.userId()){
//   }
// });

if (Meteor.isClient) {
  Session.set("DocumentTitle",'微商城');
  Deps.autorun(function(){
    document.title = Session.get("DocumentTitle");
  });
}
