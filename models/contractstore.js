'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contractStore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contractStore.init({
    store_uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    worker_uuid: DataTypes.STRING,
    contract_uuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contractStore',
  });
  return contractStore;
};