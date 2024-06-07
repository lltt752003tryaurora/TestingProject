'use strict';
const {
  Model,
  DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      this.belongsToMany(models.User, { through: models.ProjectMember, foreignKey: 'projectId', as: 'members' });
      this.hasMany(models.Requirement, { foreignKey: 'projectId', as: 'requirements' });
      this.hasMany(models.Release, { foreignKey: 'projectId', as: 'releases' });
      this.hasMany(models.Module, { foreignKey: 'projectId', as: 'modules' });
      this.hasMany(models.TestPlan, { foreignKey: 'projectId', as: 'testPlans' });
      this.hasMany(models.TestCase, { foreignKey: 'projectId', as: 'testCases' });
      this.hasMany(models.TestRun, { foreignKey: 'projectId', as: 'testRuns' });
      this.hasMany(models.TestRunCase, { foreignKey: 'projectId', as: 'testRunCases' });
      this.hasMany(models.Issue, { foreignKey: 'projectId', as: 'issues' });
      this.hasMany(models.IssueDetail, { foreignKey: 'projectId', as: 'issueDetails' });
      this.hasMany(models.Attachment, { foreignKey: 'projectId', as: 'attachments' });
      this.hasMany(models.IssueAttachment, { foreignKey: 'projectId', as: 'issueAttachments' });
      this.hasMany(models.IssueComment, { foreignKey: 'projectId', as: 'issueComments' });
      this.hasMany(models.Activity, { foreignKey: 'projectId', as: 'activities' });
    }
  }
  Project.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Project',
    timestamps: true,
    paranoid: true,
  });
  return Project;
};