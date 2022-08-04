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
    contract_uuid: DataTypes.STRING,
    company_name: DataTypes.STRING,
    ceo_name: DataTypes.STRING,
    company_number: DataTypes.STRING,
    contract_start_date: DataTypes.STRING,
    contract_end_date: DataTypes.STRING,
    work_location: DataTypes.STRING,
    work_info: DataTypes.STRING,
    work_week_time: DataTypes.STRING,
    work_type: DataTypes.STRING,
    work_start_time: DataTypes.STRING,
    work_end_time: DataTypes.STRING,
    wage_type: DataTypes.STRING,
    wage_value: DataTypes.STRING,
    bonus_percent: DataTypes.STRING,
    wage_send_type: DataTypes.STRING,
    insurance_goyong: DataTypes.BOOLEAN,
    insurance_sanjae: DataTypes.STRING,
    insurance_kookmin: DataTypes.BOOLEAN,
    insurance_gungang: DataTypes.BOOLEAN,
    sign_data_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contract',
  });
  return Contract;
};