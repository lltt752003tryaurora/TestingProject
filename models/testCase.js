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
      // this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
      this.belongsTo(models.TestPlan, { foreignKey: 'testPlanId', as: 'testPlan' });
      // this.hasMany(models.TestCaseDetail, { foreignKey: 'test_case_id', as: 'details' });
      // this.belongsToMany(models.TestRun, { through: models.TestRunCase, foreignKey: 'test_case_id', as: 'testRuns' });
      this.hasMany(models.TestRun, { foreignKey: 'testCaseId', as: 'testRuns' });
    }
  }
  TestCase.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    priority: DataTypes.STRING,
    detail: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TestCase',
  });
  return TestCase;
};