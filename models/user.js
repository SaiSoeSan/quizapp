"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "student"),
        allowNull: false,
        defaultValue: "student",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return User;
};
