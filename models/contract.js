'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contract.init({
    contract_uuid: DataTypes.TEXT,
    company_name: DataTypes.TEXT,
    ceo_name: DataTypes.TEXT,
    company_number: DataTypes.TEXT,
    contract_start_date: DataTypes.TEXT,
    contract_end_date: DataTypes.TEXT,
    work_location: DataTypes.TEXT,
    work_info: DataTypes.TEXT,
    work_week_time: DataTypes.TEXT,
    work_type: DataTypes.TEXT,
    work_start_time: DataTypes.TEXT,
    work_end_time: DataTypes.TEXT,
    wage_type: DataTypes.TEXT,
    wage_value: DataTypes.TEXT,
    bonus_percent: DataTypes.TEXT,
    wage_send_type: DataTypes.TEXT,
    insurance_goyong: DataTypes.BOOLEAN,
    insurance_sanjae: DataTypes.TEXT,
    insurance_kookmin: DataTypes.BOOLEAN,
    insurance_gungang: DataTypes.BOOLEAN,
    sign_data_url: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Contract',
  });
  return Contract;
};