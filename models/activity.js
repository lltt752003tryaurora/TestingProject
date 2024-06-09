'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Activity.init({
    type: DataTypes.STRING,
    detail: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Activity',
    timestamps: true,
    paranoid: true,
  });
  return Activity;
};