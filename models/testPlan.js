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
      // this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.hasMany(models.TestPlanComponent, { foreignKey: 'testPlanId', as: 'components' });
      this.hasMany(models.TestCase, { foreignKey: 'testPlanId', as: 'testCases' });
      // this.hasMany(models.TestRun, { foreignKey: 'test_plan_id', as: 'testRuns' });
      this.belongsTo(models.Release, { foreignKey: 'releaseId', as: 'release' });
    }
  }
  TestPlan.init({
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'TestPlan',
    timestamps: true,
    paranoid: true
  });
  return TestPlan;
};