"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("admin", "student"),
        allowNull: false,
        defaultValue: "student",
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
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
