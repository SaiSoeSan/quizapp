const { QuestionSet, Question, Option, Attempt } = require("../models");
const { validationResult } = require("express-validator");

const startAttempt = async (req, res) => {
  try {
    const { setId } = req.params;
    const userId = req.user.id;

    const questionSet = await QuestionSet.findByPk(setId, {
      include: {
        model: Question,
        as: "questions",
        include: {
          model: Option,
          as: "options",
          attributes: ["id", "option_text"],
        },
        order: [
          ["id", "ASC"],
          [{ model: Option, as: "options" }, "id", "ASC"],
        ],
      },
    });
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    const newAttempt = await Attempt.create({
      user_id: userId,
      question_set_id: setId,
    });

    res.status(201).json({
      success: true,
      message: "Attempt started successfully",
      attempt: {
        id: newAttempt.id,
        question_set: questionSet,
        questions: questionSet.questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to start attempt",
      error: error.message,
    });
  }
};

const submitAttempt = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { attemptId } = req.params;
  const { answers } = req.body;
  const userId = req.user.id;

  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit attempt",
      error: error.message,
    });
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
};
