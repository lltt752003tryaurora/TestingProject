'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestCaseDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TestCase, { foreignKey: 'test_case_id', as: 'testCase' });
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    }
  }
  TestCaseDetail.init({
    name: DataTypes.STRING,
    detail: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TestCaseDetail',
  });
  return TestCaseDetail;
};