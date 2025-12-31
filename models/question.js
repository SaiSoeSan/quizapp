"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.QuestionSet, {
        foreignKey: "question_set_id",
      });
      
      Question.hasMany(models.Option, {
        as: "options"
      });
    }
  }
  Question.init(
    {
      question_text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM,
        values: ["multiple_choice", "true_false"],
        allowNull: false,
      },
      question_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "questions",
      underscored: true,
      paranoid: true,
    }
  );
  return Question;
};
