'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IssueComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Issue, { foreignKey: 'issue_id', as: 'issue' });
      this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  IssueComment.init({
    comment: DataTypes.TEXT,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'IssueComment',
  });
  return IssueComment;
};