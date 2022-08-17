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
  Store.init(
    {
      store_uuid: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      lat: DataTypes.DOUBLE,
      lon: DataTypes.DOUBLE,
      description: DataTypes.STRING(5000),
      heart: DataTypes.BIGINT,
      address: DataTypes.STRING,
      owner_uuid: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      worker_cnt: DataTypes.INTEGER,
      received_resume_cnt: DataTypes.BIGINT,
      collect_activate: DataTypes.BOOLEAN,
      collect_desc: DataTypes.TEXT("long"),
      collect_money: DataTypes.INTEGER,
      collect_position: DataTypes.STRING,
      collect_time: DataTypes.STRING,
      collect_person_cnt: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
