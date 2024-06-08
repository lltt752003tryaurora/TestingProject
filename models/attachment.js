'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsToMany(models.Release, { through: models.ReleaseAttachment, foreignKey: 'attachmentId', as: 'releases' });
      this.belongsToMany(models.Issue, { through: models.IssueAttachment, foreignKey: 'attachmentId', as: 'issues' });
    }
  }
  Attachment.init({
    url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Attachment',
    timestamps: true,
    paranoid: true,
  });
  return Attachment;
};