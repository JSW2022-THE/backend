"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resumes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Resumes.init(
    {
      resume_uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      date_of_birth: DataTypes.STRING,
      address: DataTypes.STRING,
      etc: DataTypes.STRING(5000),
      worker_uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Resume",
    }
  );
  return Resumes;
};
