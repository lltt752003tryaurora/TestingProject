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
      this.belongsToMany(models.Project, { through: models.ProjectMember, foreignKey: 'userId', as: 'projects' });
      this.hasMany(models.TestRun, { foreignKey: 'assigned_userId', as: 'assignedTestRuns' });
      this.hasMany(models.Issue, { foreignKey: 'creator_userId', as: 'createdIssues' });
      this.hasMany(models.Issue, { foreignKey: 'assigned_userId', as: 'assignedIssues' });
      this.hasMany(models.IssueComment, { foreignKey: 'userId', as: 'issueComments' });
      this.hasMany(models.Activity, { foreignKey: 'userId', as: 'activities' });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    fullname: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true,
  });
  return User;
};