"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatRooms.init(
    {
      room_id: { type: DataTypes.STRING, primaryKey: true },
      people: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      creator: { type: DataTypes.STRING, allowNull: false },
      recent_msg: { type: DataTypes.TEXT("long"), allowNull: true },
      recent_msg_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "ChatRooms",
    }
  );
  return ChatRooms;
};
