'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init({
    kakao_access: DataTypes.STRING,
    kakao_refresh: DataTypes.STRING,
    kakao_id: {type:DataTypes.BIGINT, primaryKey: true},
    user_uuid: {type:DataTypes.STRING, primaryKey: true},
    token_uuid: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};