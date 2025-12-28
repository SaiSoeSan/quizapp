const express = require("express");
const { body } = require("express-validator");
const auth = require("../controllers/authController");
const router = express.Router();

// Validation rules
const registrationValidationRules = [
  body("email").notEmpty().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
];

router.post("/register", registrationValidationRules, auth.register);

module.exports = router;
