"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question_set_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "question_sets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_text: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      question_type: {
        allowNull: false,
        type: Sequelize.ENUM("multiple_choice", "true_false"),
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
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryInterface.dropTable("questions");
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },
};
