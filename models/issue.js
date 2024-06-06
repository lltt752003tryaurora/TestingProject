'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsTo(models.User, { foreignKey: 'creator_user_id', as: 'creator' });
      this.belongsTo(models.User, { foreignKey: 'assigned_user_id', as: 'assignedUser' });
      this.hasMany(models.Issue_Detail, { foreignKey: 'issue_id', as: 'details' });
      this.belongsToMany(models.Attachment, { through: models.Issue_Attachment, foreignKey: 'issue_id', as: 'attachments' });
      this.hasMany(models.Issue_Comment, { foreignKey: 'issue_id', as: 'comments' });
    }
  }
  Issue.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Issue',
  });
  return Issue;
};