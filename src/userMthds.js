// admin functions
var users = require("./../model/Users");
var _document = require("./../model/Documents");
var roles = require("./../model/Roles");

exports.createUser = function(userdata) {
  return new Promise(function(resolve, reject) {
    users.find({
      where: {
        $or: {
          username: userdata.username,
          email: userdata.email
        }
      }
    }).then(function(user) {
      if (user) {
        resolve("User exists", user);
      } else {
        roles.findOne({
          where: {
            rolename: userdata.rolename
          }
        }).then(function(role) {
          if (!role) {
            resolve("Role does not exist - ", userdata.rolename);
          }
          users.create(userdata).then(function(user) {
            // console.log("User created");
            resolve(user);
          }).catch(function(err) {
            console.log("Error creating user", err);
            reject(Error(err));
          });
        }).catch(function(err) {
          console.log("Error verifying role", err);
          reject(Error(err));
        });
      }
    }).catch(function(err) {
      console.log("Error verifying user", err);
      reject(Error(err));
    });
  });
};

exports.getAllUsers = function(limit) {
  var query = {};
  if (limit) query.limit = limit;
  return new Promise(function(resolve, reject) {
    users.findAll(query).then(function(users) {
      resolve(users);
    }).catch(function(err) {
      console.log("Error finding users", err);
      reject(Error(err));
    });
  });
};