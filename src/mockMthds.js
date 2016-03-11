var Promise = require("bluebird");
var _ = require("lodash");
var ModelFunc = require("./../documentManager");
var testdata = require("./../testData.json");

function userMock(testUsers) {
  var userKeys = ["firstname", "lastname", "username", "password", "rolename", "email"];
  return Promise.mapSeries(_.values(testUsers), function(userdata) {
    var createData = _.zipObject(userKeys, userdata);
    return ModelFunc.users.createUser(createData);
  });
}

function roleMock(testRoles) {
  var roleKeys = ["rolename"];
  return Promise.mapSeries(testRoles, function(role) {
    var roleData = _.zipObject(roleKeys, role.split(" "));
    return ModelFunc.roles.createRole(roleData);
  });
}

function docMock(testDocs) {
  var docKeys = ["userid", "documentName", "title", "content", "access"];
  return Promise.mapSeries(_.values(testDocs), function(doc) {
    var docData = _.zipObject(docKeys, doc);
    return ModelFunc.docs.createDocument(docData);
  });
}

var stripDataValues = function(results) {
  return _.map(results, function(result) {
    return result.dataValues;
  });
}
exports.strip = stripDataValues;

exports.populateMock = function(cb) {
  ModelFunc.sync(true).then(function() {
    roleMock(testdata.testRoles).then(function(a) {
      userMock(testdata.testUsers).then(function(b) {
        docMock(testdata.testDocs).then(function(c) {
          var roles = stripDataValues(a);
          var users = stripDataValues(b);
          var docs = stripDataValues(c);
          cb([roles, users, docs]);
        }).catch(function(err) {
          console.log("Error mocking documents", err);
          cb();
        });
      }).catch(function(err) {
        console.log("Error mocking users");
        cb();
      });
    }).catch(function(err) {
      console.log("Error mocking roles");
      cb();
    });
  });
}

exports.deleteModels = function(cb) {
  ModelFunc.sync(true).then(function() {
    cb();
  });
}