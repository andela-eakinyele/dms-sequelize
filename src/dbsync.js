// admin functions
var sequelize = require("./../src/dbconfig");
var users = require("./../model/Users");
var documents = require("./../model/Documents");
var roles = require("./../model/Roles");

roles.hasMany(users, {
  foreignKey: "rolename"
});
users.hasMany(documents, {
  foreignKey: "userid"
});

var Role_Docs = sequelize.define('Role_Docs', {}, {
  timestamps: false
});

roles.belongsToMany(documents, {
  through: Role_Docs
});

documents.belongsToMany(roles, {
  through: Role_Docs
});
// check database connection
exports.runner = function() {
  return new Promise(function(resolve, reject) {
    sequelize.authenticate().then(function(err) {
      if (err) {
        console.log('Unable to connect to the database:', err);
        return;
      } else {
        console.log('Connection has been established successfully.');
        sequelize.sync({
          force: false
        }).then(function() {
          console.log("Models successfully synced");
          resolve();
        }).catch(function(err) {
          console.log("Error syncing models", err);
          reject();
        });
      }
    });
  });
};