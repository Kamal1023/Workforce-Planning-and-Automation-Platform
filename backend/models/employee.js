const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    skillset: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Comma-separated list of skills'
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date_of_joining: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'BENCH', 'ON_LEAVE', 'TERMINATED'),
      defaultValue: 'ACTIVE'
    },
    last_bench_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    tableName: 'employees'
  });

  return Employee;
}; 