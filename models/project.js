'use strict';
const {
  Model,
  DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      this.belongsToMany(models.User, { through: models.ProjectMember, foreignKey: 'project_id', as: 'members' });
      this.hasMany(models.Requirement, { foreignKey: 'project_id', as: 'requirements' });
      this.hasMany(models.Release, { foreignKey: 'project_id', as: 'releases' });
      this.hasMany(models.Module, { foreignKey: 'project_id', as: 'modules' });
      this.hasMany(models.TestPlan, { foreignKey: 'project_id', as: 'testPlans' });
      this.hasMany(models.TestCase, { foreignKey: 'project_id', as: 'testCases' });
      this.hasMany(models.TestRun, { foreignKey: 'project_id', as: 'testRuns' });
      this.hasMany(models.TestRunCase, { foreignKey: 'project_id', as: 'testRunCases' });
      this.hasMany(models.Issue, { foreignKey: 'project_id', as: 'issues' });
      this.hasMany(models.IssueDetail, { foreignKey: 'project_id', as: 'issueDetails' });
      this.hasMany(models.Attachment, { foreignKey: 'project_id', as: 'attachments' });
      this.hasMany(models.IssueAttachment, { foreignKey: 'project_id', as: 'issueAttachments' });
      this.hasMany(models.IssueComment, { foreignKey: 'project_id', as: 'issueComments' });
      this.hasMany(models.Activity, { foreignKey: 'project_id', as: 'activities' });
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