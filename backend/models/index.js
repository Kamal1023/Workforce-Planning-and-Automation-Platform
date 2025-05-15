const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);

const db = {};

// Import models
db.User = require('./user')(sequelize, DataTypes);
db.Employee = require('./employee')(sequelize, DataTypes);
db.Project = require('./project')(sequelize, DataTypes);
db.ProjectResource = require('./projectResource')(sequelize, DataTypes);
db.LeaveRequest = require('./leaveRequest')(sequelize, DataTypes);

// Define relationships
db.Employee.belongsToMany(db.Project, { through: db.ProjectResource });
db.Project.belongsToMany(db.Employee, { through: db.ProjectResource });

db.Employee.hasMany(db.LeaveRequest);
db.LeaveRequest.belongsTo(db.Employee);

db.User.hasMany(db.LeaveRequest, { as: 'ApprovedLeaves', foreignKey: 'approved_by' });
db.LeaveRequest.belongsTo(db.User, { as: 'Approver', foreignKey: 'approved_by' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 