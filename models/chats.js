"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chats.init(
    {
      chat_id: { type: DataTypes.STRING, primaryKey: true },
      room_id: { type: DataTypes.STRING, allowNull: false },
      msg: { type: DataTypes.TEXT("long"), allowNull: false },
      sender_id: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Chats",
    }
  );
  return Chats;
};
