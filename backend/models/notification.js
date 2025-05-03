const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('BENCH_ALERT', 'LEAVE_APPROVAL'),
      allowNull: false,
      validate: {
        isIn: [['BENCH_ALERT', 'LEAVE_APPROVAL']]
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000]
      }
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'notifications',
    indexes: [
      {
        name: 'notifications_type_idx',
        fields: ['type']
      },
      {
        name: 'notifications_is_read_idx',
        fields: ['is_read']
      },
      {
        name: 'notifications_created_at_idx',
        fields: ['created_at']
      }
    ]
  });

  return Notification;
}; 