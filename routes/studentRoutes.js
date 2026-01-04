const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { body } = require("express-validator");

const submitAttemptValidationRules = [
  body("answers").isArray().withMessage("Answers must be an array"),
  body("answers.*.question_id")
    .isInt()
    .withMessage("Question ID must be an integer"),
  body("answers.*.selected_option_id")
    .isInt()
    .withMessage("Selected option ID must be an integer"),
];

router.post("/attempt", studentController.startAttempt);

// Submit an attempt
router.post(
  "/attempt/:attemptId/submit",
  submitAttemptValidationRules,
  studentController.submitAttempt
);

module.exports = router;
