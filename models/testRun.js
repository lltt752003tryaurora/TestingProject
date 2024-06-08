'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestRun extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      // this.belongsTo(models.Release, { foreignKey: 'releaseId', as: 'release' });
      // this.belongsTo(models.TestPlan, { foreignKey: 'test_plan_id', as: 'testPlan' });
      this.belongsTo(models.User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
      this.belongsTo(models.TestCase, { foreignKey: 'testCaseId', as: 'testCase' });
      // this.belongsToMany(models.TestCase, { through: models.TestRunCase, foreignKey: 'testRunId', as: 'testCases' });
    }
  }
  TestRun.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TestRun',
    timestamps: true,
    paranoid: true
  });
  return TestRun;
};