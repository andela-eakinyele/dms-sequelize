var Promise = require("bluebird");
var _ = require("lodash");
var ModelFunc = require("./../documentManager");
var testdata = require("./../testData.json");

function userMock(testUsers) {
  var userKeys = ["firstname", "lastname", "username", "password", "rolename", "email"];
  return Promise.map(_.values(testUsers), function(userdata) {
    var createData = _.zipObject(userKeys, userdata);
    return ModelFunc.users.createUser(createData);
  });
}

function roleMock(testRoles) {
  var roleKeys = ["rolename"];
  return Promise.map(testRoles, function(role) {
    var roleData = _.zipObject(roleKeys, role.split(" "));
    return ModelFunc.roles.createRole(roleData);
  });
}

function docMock(testDocs) {
  var docKeys = ["userid", "documentName", "title", "content", "access"];
  return Promise.map(_.values(testDocs), function(doc) {
    var docData = _.zipObject(docKeys, doc);
    return ModelFunc.docs.createDocument(docData);
  });
}

module.exports = function(cb) {
  ModelFunc.sync(true).then(function() {
    roleMock(testdata.testRoles).then(function(a) {
      console.log(JSON.stringify(a));
      userMock(testdata.testUsers).then(function(b) {
        // console.log(JSON.stringify(b));
        docMock(testdata.testDocs).then(function(c) {
          // console.log(c, "Olikkk");
          cb();
        }).catch(function(err) {
          console.log("Error mocking documents", err);
          cb();
        });
      }).catch(function(err) {
        console.log("Error mocking users");
      });
    }).catch(function(err) {
      console.log("Error mocking roles");
      cb();
    });
  });
}