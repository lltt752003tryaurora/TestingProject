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
      this.belongsTo(models.Requirement, { foreignKey: 'parentRequirementId', as: 'parentRequirement' });
      this.hasMany(models.Requirement, { foreignKey: 'parentRequirementId', as: 'childRequirements' });
      this.belongsTo(models.Release, { foreignKey: 'releaseId', as: 'release' });
    }
  }
  Requirement.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    parentRequirementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    releaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Requirement',
    timestamps: true,
    paranoid: true
  });
  return Requirement;
};