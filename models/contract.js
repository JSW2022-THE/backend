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
        contract_uuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        company_uuid: DataTypes.TEXT,
        secret: DataTypes.TEXT,
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
        insurance_goyong: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        insurance_sanjae: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        insurance_kookmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        insurance_gungang: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sign_data_url: DataTypes.TEXT,
        rest_start_time: DataTypes.TEXT,
        rest_end_time: DataTypes.TEXT,
        document_family: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        document_agreement: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        worker_name: DataTypes.TEXT,
        work_rest_day: DataTypes.TEXT,
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        worker_sign_data_url: DataTypes.TEXT,
        worker_uuid: DataTypes.TEXT,
        owner_uuid: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Contract',
    });
    return Contract;
};