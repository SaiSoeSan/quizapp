"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attempt_answers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      attempt_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "attempts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "questions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      selected_option_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "options",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      is_correct: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AttemptAnswers");
  },
};
