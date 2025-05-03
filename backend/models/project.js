const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    project_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    offshore_headcount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    onsite_headcount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'COMPLETED', 'ON_HOLD'),
      defaultValue: 'ACTIVE'
    }
  }, {
    timestamps: true,
    tableName: 'projects'
  });

  return Project;
}; 