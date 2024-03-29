"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      kakao_id: { type: DataTypes.BIGINT, primaryKey: true },
      uuid: DataTypes.STRING,
        phone_number: DataTypes.STRING,
      name: DataTypes.STRING,
      agree_terms_of_service: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      age: DataTypes.INTEGER,
      category: DataTypes.STRING,
      is_online: DataTypes.BOOLEAN,
      last_online: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
