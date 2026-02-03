"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AttemptAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AttemptAnswer.belongsTo(models.Attempt, {
        foreignKey: "attemptId",
        as: "attempt",
      });
      AttemptAnswer.belongsTo(models.Question, {
        foreignKey: "questionId",
        as: "question",
      });
      AttemptAnswer.belongsTo(models.Option, {
        foreignKey: "selectedOptionId",
        as: "selectedOption",
      });
    }
  }
  AttemptAnswer.init(
    {
      attemptId: {
        type: DataTypes.INTEGER,
        field: "attempt_id",
      },
      questionId: {
        type: DataTypes.INTEGER,
        field: "question_id",
      },
      selectedOptionId: {
        type: DataTypes.INTEGER,
        field: "selected_option_id",
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        field: "is_correct",
      },
    },
    {
      sequelize,
      modelName: "AttemptAnswer",
      tableName: "attempt_answers",
      underscored: true,
      paranoid: true,
    },
  );
  return AttemptAnswer;
};
