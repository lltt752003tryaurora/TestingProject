'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Run extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id' });
      this.belongsTo(models.Release, { foreignKey: 'release_id' });
      this.belongsTo(models.Test_Plan, { foreignKey: 'test_plan_id' });
      this.belongsTo(models.User, { foreignKey: 'assigned_user_id' });
      this.belongsToMany(models.Test_Case, { through: models.Test_Run_Case, foreignKey: 'test_run_id' });
    }
  }
  Test_Run.init({
    name: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test_Run',
  });
  return Test_Run;
};