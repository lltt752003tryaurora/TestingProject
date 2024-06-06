'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Plan_Component extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Test_Plan, { foreignKey: 'test_plan_id', as: 'testPlan' });
    }
  }
  Test_Plan_Component.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test_Plan_Component',
  });
  return Test_Plan_Component;
};