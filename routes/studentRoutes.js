const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { body } = require("express-validator");
const { authenticate, studentOnly } = require("../middleware/auth");

router.use([authenticate, studentOnly]);

const submitAttemptValidationRules = [
  body("answers").isArray().withMessage("Answers must be an array"),
  body("answers.*.question_id")
    .isInt()
    .withMessage("Question ID must be an integer"),
  body("answers.*.selected_option_id")
    .isInt()
    .withMessage("Selected option ID must be an integer"),
];

// Student dashboard overview
router.get("/dashboard", studentController.getDashboard);

// Get all question sets with progress
router.get("/question-sets", studentController.getQuestionSets);

// Get single question set by ID
router.get("/question-sets/:id", studentController.getQuestionSetById);

// Get or create attempt for practice (returns questions)
router.get("/question-sets/:setId/attempt", studentController.getOrCreateAttempt);

// Start a new attempt (legacy endpoint, kept for compatibility)
router.post("/question-sets/:setId/attempt", studentController.startAttempt);

// Get attempt result
router.get("/attempt/:attemptId/result", studentController.getAttemptResult);

// Submit an attempt
router.post(
  "/attempt/:attemptId/submit",
  submitAttemptValidationRules,
  studentController.submitAttempt
);

module.exports = router;
