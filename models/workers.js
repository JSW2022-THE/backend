'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Workers.init({
    woker_uuid: DataTypes.STRING,
    store_uuid: DataTypes.STRING,
    work_week_time: DataTypes.STRING,
    wage_value: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Workers',
  });
  return Workers;
};