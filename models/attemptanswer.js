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
        foreignKey: "attempt_id",
        as: "attempt",
      });
      AttemptAnswer.belongsTo(models.Question, {
        foreignKey: "question_id",
        as: "question",
      });
      AttemptAnswer.belongsTo(models.Option, {
        foreignKey: "selected_option_id",
        as: "selectedOption",
      });
    }
  }
  AttemptAnswer.init(
    {
      attempt_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      selected_option_id: DataTypes.INTEGER,
      is_correct: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "AttemptAnswer",
      tableName: "attempt_answers",
      underscored: true,
      paranoid: true,
    }
  );
  return AttemptAnswer;
};
