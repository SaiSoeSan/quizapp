"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QuestionSet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuestionSet.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      youtube_link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "QuestionSet",
      tableName: "question_sets",
      underscored: true,
      paranoid: true,
    }
  );
  return QuestionSet;
};
