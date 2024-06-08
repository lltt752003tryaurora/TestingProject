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
      // this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.User, { foreignKey: 'creatorUserId', as: 'creator' });
      this.belongsTo(models.User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
      // this.hasMany(models.IssueDetail, { foreignKey: 'issueId', as: 'details' });
      this.belongsToMany(models.Attachment, { through: models.IssueAttachment, foreignKey: 'issueId', as: 'attachments' });
      this.hasMany(models.IssueComment, { foreignKey: 'issueId', as: 'comments' });
      this.belongsTo(models.TestRun, { foreignKey: 'testRunId', as: 'testRun' });
    }
  }
  Issue.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    priority: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Issue',
    timestamps: true,
    paranoid: true,
  });
  return Issue;
};