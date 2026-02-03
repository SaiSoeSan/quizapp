"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Option.belongsTo(models.Question, {
        foreignKey: "questionId",
        as: "question",
      });
    }
  }
  Option.init(
    {
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "question_id",
      },
      optionText: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "option_text",
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_correct",
      },
    },
    {
      sequelize,
      modelName: "Option",
      tableName: "options",
      underscored: true,
      paranoid: true,
    },
  );
  return Option;
};
