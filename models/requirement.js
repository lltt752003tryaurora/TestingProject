'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Requirement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsTo(models.Requirement, { foreignKey: 'parent_requirement_id', as: 'parentRequirement' });
      this.hasMany(models.Requirement, { foreignKey: 'parent_requirement_id', as: 'childRequirements' });
      this.belongsTo(models.Release, { foreignKey: 'release_id', as: 'release' });
    }
  }
  Requirement.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    parent_requirement_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Requirement',
  });
  return Requirement;
};