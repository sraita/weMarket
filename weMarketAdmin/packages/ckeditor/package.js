Package.describe({
  name: "sraita:ckeditor",
  summary:"Latest version CKEditor",
  version: "4.7.2",
  git:"https://sraita.com/sraita/meteor-ckeditor.git"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.addFiles('load.js','client');
});