"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReceivedResumes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReceivedResumes.init(
    {
      resume_uuid: DataTypes.STRING,
      store_uuid: DataTypes.STRING,
      worker_uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      date_of_birth: DataTypes.STRING,
      address: DataTypes.STRING,
      etc: DataTypes.STRING,
      state: DataTypes.STRING,
      phone_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ReceivedResumes",
    }
  );
  return ReceivedResumes;
};
