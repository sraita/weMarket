// Meteor.absoluteUrl.defaultOptions.rootUrl = "http://192.168.0.116:3000"
ROOT_URL = (typeof process !== "undefined" && process !== null ? process.env.ROOT_URL : void 0) || "admin-market.raidcdn.cn";
Meteor.absoluteUrl.defaultOptions.rootUrl = ROOT_URL;