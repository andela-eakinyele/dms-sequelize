var users = require("./../model/Users");
var _document = require("./../model/Documents");
var roles = require("./../model/Roles");


exports.createRole = function(roledata) {
  return new Promise(function(resolve, reject) {
    roles.findOrCreate({
      where: {
        rolename: roledata.rolename
      }
    }).spread(function(role, created) {
      if (role) {
        resolve(role);
      } else {
        resolve("role exists already");
      }
    }).catch(function(err) {
      console.log("Error verifying/creating role", err);
      reject(Error(err));
    });
  });
};

exports.getAllRoles = function(limit) {
    var query = {};
  if (limit) query.limit = limit;
  return new Promise(function(resolve, reject) {
    roles.findAll(query).then(function(role) {
      resolve(role);
    }).catch(function(err) {
      console.log("Error finding roles", err);
      reject(Error(err));
    });
  });
};