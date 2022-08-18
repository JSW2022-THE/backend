'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReceivedResumes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      resume_uuid: {
        type: Sequelize.STRING
      },
      store_uuid: {
        type: Sequelize.STRING
      },
      worker_uuid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      etc: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReceivedResumes');
  }
};