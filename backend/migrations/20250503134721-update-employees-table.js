'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Add new columns or modify existing ones
    await queryInterface.addColumn('employees', 'department', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('employees', 'designation', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('employees', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Modify existing columns if needed
    await queryInterface.changeColumn('employees', 'skillset', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Comma-separated list of skills'
    });

    // Add new enum values if needed
    await queryInterface.changeColumn('employees', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'BENCH', 'ON_LEAVE', 'TERMINATED'),
      defaultValue: 'ACTIVE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Remove added columns
    await queryInterface.removeColumn('employees', 'department');
    await queryInterface.removeColumn('employees', 'designation');
    await queryInterface.removeColumn('employees', 'phone_number');

    // Revert column changes
    await queryInterface.changeColumn('employees', 'skillset', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Revert enum changes
    await queryInterface.changeColumn('employees', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'BENCH', 'ON_LEAVE'),
      defaultValue: 'ACTIVE'
    });
  }
};
