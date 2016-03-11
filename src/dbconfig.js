var Sequelize = require('sequelize');
var sequelize = new Sequelize("dms_v1", "dmsone", "a", {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
  syncOnAssociation: true
});

module.exports = sequelize;