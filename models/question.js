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
        foreignKey: "questionSetId",
      });

      Question.hasMany(models.Option, {
        as: "options",
      });
    }
  }
  Question.init(
    {
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "question_text",
      },
      questionType: {
        type: DataTypes.ENUM,
        values: ["multiple_choice", "true_false"],
        allowNull: false,
        field: "question_type",
      },
      questionSetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "question_set_id",
      },
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "questions",
      underscored: true,
      paranoid: true,
      hooks: {
        afterDestroy: async (question, options) => {
          const { Option } = sequelize.models;
          await Option.destroy({
            where: { questionId: question.id },
            transaction: options.transaction,
          });
        },
      },
    },
  );
  return Question;
};
