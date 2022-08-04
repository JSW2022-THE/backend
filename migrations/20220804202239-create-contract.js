'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contract_uuid: {
        type: Sequelize.STRING
      },
      company_name: {
        type: Sequelize.STRING
      },
      ceo_name: {
        type: Sequelize.STRING
      },
      company_number: {
        type: Sequelize.STRING
      },
      contract_start_date: {
        type: Sequelize.STRING
      },
      contract_end_date: {
        type: Sequelize.STRING
      },
      work_location: {
        type: Sequelize.STRING
      },
      work_info: {
        type: Sequelize.STRING
      },
      work_week_time: {
        type: Sequelize.STRING
      },
      work_type: {
        type: Sequelize.STRING
      },
      work_start_time: {
        type: Sequelize.STRING
      },
      work_end_time: {
        type: Sequelize.STRING
      },
      wage_type: {
        type: Sequelize.STRING
      },
      wage_value: {
        type: Sequelize.STRING
      },
      bonus_percent: {
        type: Sequelize.STRING
      },
      wage_send_type: {
        type: Sequelize.STRING
      },
      insurance_goyong: {
        type: Sequelize.BOOLEAN
      },
      insurance_sanjae: {
        type: Sequelize.STRING
      },
      insurance_kookmin: {
        type: Sequelize.BOOLEAN
      },
      insurance_gungang: {
        type: Sequelize.BOOLEAN
      },
      sign_data_url: {
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
    await queryInterface.dropTable('Contracts');
  }
};