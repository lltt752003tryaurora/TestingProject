'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Run_Case extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Test_Run, { foreignKey: 'test_run_id', as: 'testRun' });
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsTo(models.Test_Case, { foreignKey: 'test_case_id', as: 'testCase' });
    }
  }
  Test_Run_Case.init({
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test_Run_Case',
  });
  return Test_Run_Case;
};