const { Sequelize } = require('sequelize');
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


const User = require('./user')(sequelize);
const Employee = require('./employee')(sequelize);
const Project = require('./project')(sequelize);
const ProjectResource = require('./projectResource')(sequelize);
const LeaveRequest = require('./leaveRequest')(sequelize);

// Define relationships
Employee.belongsToMany(Project, { through: ProjectResource });
Project.belongsToMany(Employee, { through: ProjectResource });

Employee.hasMany(LeaveRequest);
LeaveRequest.belongsTo(Employee);

User.hasMany(LeaveRequest, { as: 'ApprovedLeaves', foreignKey: 'approved_by' });
LeaveRequest.belongsTo(User, { as: 'Approver', foreignKey: 'approved_by' });

module.exports = {
  sequelize,
  User,
  Employee,
  Project,
  ProjectResource,
  LeaveRequest
}; 