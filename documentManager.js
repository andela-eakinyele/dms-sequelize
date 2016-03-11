var authSyncModels = require("./src/dbsync");
var userFunc = require("./src/userMthds");
var roleFunc = require("./src/roleMthds");
var docFunc = require("./src/docMthds");
var helpFunc = require("./src/helpfunc");

module.exports = {
  users: userFunc,
  docs: docFunc,
  roles: roleFunc,
  sync: authSyncModels
};