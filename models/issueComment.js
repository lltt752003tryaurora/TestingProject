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
      this.belongsTo(models.Issue, { foreignKey: 'issueId', as: 'issue' });
      // this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  IssueComment.init({
    comment: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'IssueComment',
    timestamps: true,
    paranoid: true,
  });
  return IssueComment;
};