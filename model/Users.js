var sequelize = require("./../src/dbconfig");
var Sequelize = require('sequelize');

var Users = sequelize.define("Users", {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    set: function(val) {
      this.setDataValue('firstname', val[0].toUpperCase() + val.slice(1));
    },
    validate: {
      isAlpha: true,
      notEmpty: true
    }
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    set: function(val) {
      this.setDataValue('lastname', val[0].toUpperCase() + val.slice(1));
    },
    validate: {
      isAlpha: true,
      notEmpty: true
    }
  },
  userid: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    validate: {
      isNumeric: true,
      notEmpty: true,
      min: 100
    }
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    get: function() {
      var id = this.getDataValue('userid');
      return this.getDataValue('username') + '(' + id + ")";
    },
    validate: {
      isAlphanumeric: true,
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  }
}, {
  timestamps: false,
  getterMethods: {
    fullName: function() {
      return this.getDataValue('firstname') + ' ' + this.getDataValue('lastname');
    }
  },
  setterMethods: {
    fullName: function(value) {
      var names = value.split(' ');

      this.setDataValue('firstname', names.slice(0, -1).join(' '));
      this.setDataValue('lastname', names.slice(-1).join(' '));
    }
  }
});

module.exports = Users;