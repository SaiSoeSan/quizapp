const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const admin = require("../controllers/adminController");

// Validation rules
const createQuestionSetValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("youtube_link").optional().isURL().withMessage("Must be a valid URL"),
];
const createQuestionValidationRules = [
  body("question_text").notEmpty().withMessage("Question text is required"),
  body("question_type")
    .notEmpty()
    .isIn(["multiple_choice", "true_false"])
    .withMessage(
      "Question type must be either 'multiple_choice' or 'true_false'"
    ),
  body("options")
    .isArray({ min: 2 })
    .withMessage("At least two options are required"),
  body("correct_option").notEmpty().withMessage("Correct option is required"),
];

router.post(
  "/question-sets",
  createQuestionSetValidationRules,
  admin.createQuestionSet
);

router.get("/question-sets", admin.getAllQuestionSets);
router.delete("/question-sets/:id", admin.deleteQuestionSet);
router.put(
  "/question-sets/:id",
  createQuestionSetValidationRules,
  admin.updateQuestionSet
);

router.post(
  "/question-sets/:setId/questions",
  createQuestionValidationRules,
  admin.createQuestion
);

router.get("/question-sets/:setId/questions", admin.getQuestionsBySetId);

module.exports = router;
