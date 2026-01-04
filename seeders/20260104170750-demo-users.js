"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = await bcrypt.hash("password", 10);
    const studentPassword = await bcrypt.hash("password", 10);

    await queryInterface.bulkInsert("users", [
      {
        email: "admin@quizapp.com",
        phone: "09123456789",
        password: adminPassword,
        first_name: "Admin",
        last_name: "User",
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "student@quizapp.com",
        phone: "09987654321",
        password: studentPassword,
        first_name: "Student",
        last_name: "User",
        role: "student",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
