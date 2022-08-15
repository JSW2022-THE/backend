"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Store.init({
    store_uuid: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lon: DataTypes.DOUBLE,
    description: DataTypes.STRING(5000),
    heart: DataTypes.BIGINT,
    address: DataTypes.STRING,
    owner_uuid: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    worker_cnt: DataTypes.INTEGER,
    receivedContract_cnt: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};
