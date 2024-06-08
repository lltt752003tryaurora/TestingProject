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
      this.belongsTo(models.TestPlan, { foreignKey: 'testPlanId', as: 'testPlan' });
    }
  }
  TestPlanComponent.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'TestPlanComponent',
    timestamps: true,
    paranoid: true,
  });
  return TestPlanComponent;
};