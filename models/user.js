'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Project, { through: models.ProjectMember, foreignKey: 'user_id', });
      this.hasMany(models.Test_Run, { foreignKey: 'assigned_user_id', });
      this.hasMany(models.Issue, { foreignKey: 'creator_user_id', });
      this.hasMany(models.Issue, { foreignKey: 'assigned_user_id', });
      this.hasMany(models.Issue_Comment, { foreignKey: 'user_id', });
      this.hasMany(models.Activity, { foreignKey: 'user_id', });
    }
  }
  User.init({
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};