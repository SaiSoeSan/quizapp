"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("question_sets", [
      {
        title: "JavaScript Basics",
        description: "Test your fundamental JavaScript knowledge",
        youtube_link: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Node.js Fundamentals",
        description: "Learn about Node.js core concepts",
        youtube_link: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "SQL Basics",
        description: "Test your database knowledge",
        youtube_link: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("question_sets", null, {});
  },
};
