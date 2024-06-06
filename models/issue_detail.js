'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Issue_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Issue, { foreignKey: 'issue_id', as: 'issue' });
      this.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' });
    }
  }
  Issue_Detail.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Issue_Detail',
  });
  return Issue_Detail;
};