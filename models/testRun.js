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
<<<<<<< HEAD:models/testRun.js
      this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.Release, { foreignKey: 'release_id', as: 'release' });
      this.belongsTo(models.TestPlan, { foreignKey: 'test_plan_id', as: 'testPlan' });
      this.belongsTo(models.User, { foreignKey: 'assigned_userId', as: 'assignedUser' });
      this.belongsToMany(models.TestCase, { through: models.TestRunCase, foreignKey: 'test_run_id', as: 'testCases' });
=======
      this.belongsTo(models.Project, { foreignKey: 'project_id' });
      this.belongsTo(models.Release, { foreignKey: 'release_id' });
      this.belongsTo(models.Test_Plan, { foreignKey: 'test_plan_id' });
      this.belongsTo(models.User, { foreignKey: 'assigned_user_id' });
      this.belongsToMany(models.Test_Case, { through: models.Test_Run_Case, foreignKey: 'test_run_id' });
>>>>>>> refs/remotes/origin/master:models/test_run.js
    }
  }
  TestRun.init({
    name: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TestRun',
  });
  return TestRun;
};