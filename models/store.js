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
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lon: DataTypes.DOUBLE,
    description: DataTypes.STRING(5000),
    heart: DataTypes.BIGINT,
    address: DataTypes.STRING,
    owner_uuid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Store',
  });
  return Store;
};
