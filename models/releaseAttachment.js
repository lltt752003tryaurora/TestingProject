
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReleaseAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Release, { foreignKey: "releaseId" })
      this.belongsTo(models.Attachment, { foreignKey: "attachmentId" })
    }
  }
  ReleaseAttachment.init({
  }, {
    sequelize,
    modelName: 'ReleaseAttachment',
    timestamps: true,
    paranoid: true,
  });
  return ReleaseAttachment;
};
