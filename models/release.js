'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Release extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsToMany(models.Attachment, { through: models.ReleaseAttachment, foreignKey: 'releaseId', as: 'attachments' });
      // this.hasMany(models.TestRun, { foreignKey: 'releaseId', as: 'testRuns' });
      this.hasMany(models.TestPlan, { foreignKey: 'releaseId', as: 'testPlans' });
      this.hasMany(models.Requirement, { foreignKey: 'releaseId', as: 'requirements' });
    }
  }
  Release.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Release',
    timestamps: true,
    paranoid: true,
  });
  return Release;
};