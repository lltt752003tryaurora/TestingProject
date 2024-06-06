'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test_Case_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Test_Case, { foreignKey: 'test_case_id', as: 'testCase' });
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    }
  }
  Test_Case_Detail.init({
    name: DataTypes.STRING,
    detail: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Test_Case_Detail',
  });
  return Test_Case_Detail;
};