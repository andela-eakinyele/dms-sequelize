var sequelize = require("./../src/dbconfig");
var Sequelize = require('sequelize');
var users = require("./Users");

var Document = sequelize.define("Document", {
  documentId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    validate: {
      isNumeric: true,
      notNull: true,
      notEmpty: true,
    }
  },
  documentName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.TEXT,
    set: function(val) {
      this.setDataValue('title', val.toUpperCase());
    }
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamp: true,
  createdAt: 'dateCreated',
  updatedAt: 'lastModified',
  getterMethods: {
    dateCreated: function() {
      var useDate = this.getDataValue('dateCreated');
      return new Date(useDate).toDateString();
    },
    lastModified: function() {
      var useDate = this.getDataValue('lastModified');
      return new Date(useDate).toDateString();
    }
  },
  setterMethods: {
    createdAt: function(val) {
      this.setDataValue('createdAt', new Date(val).toDateString());
    },
     lastModified: function(val) {
      this.setDataValue('lastModified', new Date(val).toDateString());
    }
  }
});

module.exports = Document;