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
        foreignKey: "user_id",
        as: "user"
      });
      Attempt.belongsTo(models.QuestionSet, {
        foreignKey: "question_set_id",
        as: "questionSet",
      });
      Attempt.hasMany(models.AttemptAnswer, {
        foreignKey: "attempt_id",
        as: "attemptAnswers",
      });
    }
  }
  Attempt.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_submitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      submitted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Attempt",
      tableName: "attempts",
      underscored: true,
      paranoid: true,
    }
  );
  return Attempt;
};
