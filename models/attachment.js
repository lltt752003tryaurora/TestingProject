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
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsToMany(models.Release, { through: models.ReleaseAttachment, foreignKey: 'attachment_id', as: 'releases' });
      this.belongsToMany(models.Issue, { through: models.IssueAttachment, foreignKey: 'attachment_id', as: 'issues' });
    }
  }
  Attachment.init({
    file_path: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};