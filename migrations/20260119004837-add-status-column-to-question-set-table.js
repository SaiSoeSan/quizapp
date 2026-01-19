"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("question_sets", "status", {
      type: Sequelize.ENUM("draft", "active"),
      after: "youtube_link",
      allowNull: false,
      defaultValue: "draft",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     */
    await queryInterface.removeColumn("question_sets", "status");
  },
};
