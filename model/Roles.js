var sequelize = require("./../src/dbconfig");
var Sequelize = require('sequelize');

var Roles = sequelize.define("Roles", {
  roleId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    validate: {
      isNumeric: true,
      notEmpty: true,
      min: 100
    }
  },
  rolename: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    set: function(val) {
      this.setDataValue('rolename', val[0].toUpperCase() + val.slice(1));
    },
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: false
});

module.exports = Roles;