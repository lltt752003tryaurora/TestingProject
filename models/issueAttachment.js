'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IssueAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Attachment, { foreignKey: "attachment_id" })
      this.belongsTo(models.Issue, { foreignKey: "issue_id" })
    }
  }
  IssueAttachment.init({
  }, {
    sequelize,
    modelName: 'IssueAttachment',
  });
  return IssueAttachment;
};