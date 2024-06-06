'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Case extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsTo(models.Module, { foreignKey: 'module_id', as: 'module' });
      this.belongsTo(models.Test_Plan, { foreignKey: 'test_plan_id', as: 'testPlan' });
      this.hasMany(models.Test_Case_Detail, { foreignKey: 'test_case_id', as: 'details' });
      this.belongsToMany(models.Test_Run, { through: models.Test_Run_Case, foreignKey: 'test_case_id', as: 'testRuns' });
    }
  }
  Test_Case.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    priority: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test_Case',
  });
  return Test_Case;
};