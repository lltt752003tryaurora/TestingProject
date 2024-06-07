'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestCase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.Module, { foreignKey: 'module_id', as: 'module' });
      this.belongsTo(models.TestPlan, { foreignKey: 'test_plan_id', as: 'testPlan' });
      this.hasMany(models.TestCaseDetail, { foreignKey: 'test_case_id', as: 'details' });
      this.belongsToMany(models.TestRun, { through: models.TestRunCase, foreignKey: 'test_case_id', as: 'testRuns' });
    }
  }
  TestCase.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    priority: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TestCase',
  });
  return TestCase;
};