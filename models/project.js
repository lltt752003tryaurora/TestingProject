'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, { through: models.ProjectMember, foreignKey: 'project_id', as: 'members' });
      this.hasMany(models.Requirement, { foreignKey: 'project_id', as: 'requirements' });
      this.hasMany(models.Release, { foreignKey: 'project_id', as: 'releases' });
      this.hasMany(models.Module, { foreignKey: 'project_id', as: 'modules' });
      this.hasMany(models.Test_Plan, { foreignKey: 'project_id', as: 'testPlans' });
      this.hasMany(models.Test_Case, { foreignKey: 'project_id', as: 'testCases' });
      this.hasMany(models.Test_Run, { foreignKey: 'project_id', as: 'testRuns' });
      this.hasMany(models.Test_Run_Case, { foreignKey: 'project_id', as: 'testRunCases' });
      this.hasMany(models.Issue, { foreignKey: 'project_id', as: 'issues' });
      this.hasMany(models.Issue_Detail, { foreignKey: 'project_id', as: 'issueDetails' });
      this.hasMany(models.Attachment, { foreignKey: 'project_id', as: 'attachments' });
      this.hasMany(models.Issue_Attachment, { foreignKey: 'project_id', as: 'issueAttachments' });
      this.hasMany(models.Issue_Comment, { foreignKey: 'project_id', as: 'issueComments' });
      this.hasMany(models.Activity, { foreignKey: 'project_id', as: 'activities' });
    }
  }
  Project.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};