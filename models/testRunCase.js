'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestRunCase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TestRun, { foreignKey: 'test_run_id', as: 'testRun' });
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsTo(models.TestCase, { foreignKey: 'test_case_id', as: 'testCase' });
    }
  }
  TestRunCase.init({
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TestRunCase',
  });
  return TestRunCase;
};