'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.hasMany(models.TestPlanComponent, { foreignKey: 'test_plan_id', as: 'components' });
      this.hasMany(models.TestCase, { foreignKey: 'test_plan_id', as: 'testCases' });
      this.hasMany(models.TestRun, { foreignKey: 'test_plan_id', as: 'testRuns' });
    }
  }
  TestPlan.init({
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TestPlan',
  });
  return TestPlan;
};