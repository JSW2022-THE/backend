'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  resume.init({
    name: DataTypes.STRING,
    date_or_birth: DataTypes.STRING,
    address: DataTypes.STRING,
    etc: DataTypes.STRING(5000),
  }, {
    sequelize,
    modelName: 'resume',
  });
  return resume;
};