'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Release extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
      this.belongsToMany(models.Attachment, { through: models.Release_Attachment, foreignKey: 'release_id', as: 'attachments' });
      this.hasMany(models.Test_Run, { foreignKey: 'release_id', as: 'testRuns' });
      this.hasMany(models.Requirement, { foreignKey: 'release_id', as: 'requirements' });
    }
  }
  Release.init({
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Release',
  });
  return Release;
};