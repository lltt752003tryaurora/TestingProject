'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestPlanComponent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TestPlan, { foreignKey: 'test_plan_id', as: 'testPlan' });
    }
  }
  TestPlanComponent.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TestPlanComponent',
  });
  return TestPlanComponent;
};