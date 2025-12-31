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

module.exports = router;
