"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attempt.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Attempt.belongsTo(models.QuestionSet, {
        foreignKey: "questionSetId",
        as: "questionSet",
      });
      Attempt.hasMany(models.AttemptAnswer, {
        foreignKey: "attemptId",
        as: "attemptAnswers",
      });
    }
  }
  Attempt.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      questionSetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "question_set_id",
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isSubmitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_submitted",
      },
      submittedAt: {
        type: DataTypes.DATE,
        field: "submitted_at",
      },
    },
    {
      sequelize,
      modelName: "Attempt",
      tableName: "attempts",
      underscored: true,
      paranoid: true,
    },
  );
  return Attempt;
};
