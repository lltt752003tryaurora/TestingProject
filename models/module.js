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
      this.belongsTo(models.Module, { foreignKey: 'parentModuleId', as: 'parentModule' });
      this.hasMany(models.Module, { foreignKey: 'parentModuleId', as: 'childModules' });
      this.hasMany(models.TestCase, { foreignKey: 'moduleId', as: 'testCases' });
    }
  }
  Module.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    parentModuleId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Module',
    timestamps: true,
    paranoid: true,
  });
  return Module;
};