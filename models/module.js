'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.Module, { foreignKey: 'parent_module_id', as: 'parentModule' });
      this.hasMany(models.Module, { foreignKey: 'parent_module_id', as: 'childModules' });
      this.hasMany(models.TestCase, { foreignKey: 'module_id', as: 'testCases' });
    }
  }
  Module.init({
    name: DataTypes.STRING,
    parent_module_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};