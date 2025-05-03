const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProjectResource = sequelize.define('ProjectResource', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'project_resources'
  });

  return ProjectResource;
}; 