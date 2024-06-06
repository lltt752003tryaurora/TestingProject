'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Release_Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Release, { foreignKey: "release_id" })
      this.belongsTo(models.Attachment, { foreignKey: "attachment_id" })
    }
  }
  Release_Attachment.init({
  }, {
    sequelize,
    modelName: 'Release_Attachment',
  });
  return Release_Attachment;
};