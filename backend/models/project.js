module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    projectCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'project_code'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'customer_name'
    },
    offshoreHeadcount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'offshore_headcount'
    },
    onsiteHeadcount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'onsite_headcount'
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    actions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date'
    }
  }, {
    tableName: 'projects',
    timestamps: true,
    underscored: true
  });

  Project.associate = models => {
    Project.hasMany(models.ProjectResource, { 
      foreignKey: 'project_id',
      as: 'resources'
    });
  };

  return Project;
};
