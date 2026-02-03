const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const admin = require("../controllers/adminController");
const { authenticate, adminOnly } = require("../middleware/auth");

router.use([authenticate, adminOnly]);

// Validation rules
const createQuestionSetValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("youtubeLink")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Must be a valid URL"),
  body("status")
    .optional()
    .isIn(["draft", "active"])
    .withMessage("Status must be either 'draft' or 'active'"),
];

const createQuestionValidationRules = [
  body("questionText").notEmpty().withMessage("Question text is required"),
  body("questionType")
    .notEmpty()
    .isIn(["multiple_choice", "true_false"])
    .withMessage(
      "Question type must be either 'multiple_choice' or 'true_false'",
    ),
  body("options")
    .isArray({ min: 2 })
    .withMessage("At least two options are required"),

  body("options.*.optionText")
    .notEmpty()
    .withMessage("Option text is required"),
  body("options.*.isCorrect")
    .notEmpty()
    .isBoolean()
    .withMessage("Correct option is required"),
];

const createStudentValidationRules = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").optional().isString(),
];

// Question Set routes
router.post(
  "/question-sets",
  createQuestionSetValidationRules,
  admin.createQuestionSet,
);
router.get("/question-sets", admin.getAllQuestionSets);
router.get("/question-sets/:id", admin.getQuestionSetById);
router.delete("/question-sets/:id", admin.deleteQuestionSet);
router.put(
  "/question-sets/:id",
  createQuestionSetValidationRules,
  admin.updateQuestionSet,
);
// Create Question routes
router.post(
  "/question-sets/:setId/questions",
  createQuestionValidationRules,
  admin.createQuestion,
);
router.get("/question-sets/:setId/questions", admin.getQuestionsBySetId);
router.put(
  "/question-sets/:setId/questions/:questionId",
  createQuestionValidationRules,
  admin.updateQuestion,
);
router.delete(
  "/question-sets/:setId/questions/:questionId",
  admin.deleteQuestion,
);

// User management routes
router.get("/users", admin.getAllStudents);
router.post("/users", createStudentValidationRules, admin.createStudent);
router.get("/users/:id", admin.getUserById);
router.put("/users/:id", admin.updateUser);
router.delete("/users/:id", admin.deleteUser);

// Attempt management routes
router.get("/attempts/stats", admin.getAttemptStats);
router.get("/attempts", admin.getAllAttempts);

module.exports = router;
