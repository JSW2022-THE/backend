"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Resume.init(
    {
      name: DataTypes.STRING,
      date_or_birth: DataTypes.STRING,
      address: DataTypes.STRING,
      etc: DataTypes.STRING(5000),
      user_uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      state: DataTypes.STRING, //state는 open 또는 close 상태
    },
    {
      sequelize,
      modelName: "Resume",
    }
  );
  return Resume;
};
