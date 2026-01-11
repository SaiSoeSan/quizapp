const {
  QuestionSet,
  Question,
  Option,
  Attempt,
  AttemptAnswer,
} = require("../models");
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

const submitAttempt = async (req, res) => {
  try {
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

    const attempt = await Attempt.findOne({
      where: { id: attemptId, user_id: userId },
      include: {
        model: QuestionSet,
        as: "question_set",
        include: {
          model: Question,
          as: "questions",
        },
      },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (attempt.is_submitted) {
      return res.status(400).json({
        success: false,
        message: "Attempt has already been submitted",
      });
    }

    let score = 0;
    let results = [];

    for (const answer of answers) {
      const { question_id, selected_option_id } = answer;

      const question = await Question.findByPk(question_id, {
        include: {
          model: Option,
          as: "options",
        },
      });

      if (!question) {
        continue;
      }

      const selectedOption = question.options.find(
        (opt) => opt.id === selected_option_id
      );

      const correctOption = question.options.find((opt) => opt.is_correct);
      const isCorrect = selectedOption?.is_correct || false;

      if (isCorrect) score += 1;

      // Save the answer
      await AttemptAnswer.create({
        attempt_id: attemptId,
        question_id,
        selected_option_id,
        is_correct: isCorrect,
      });

      results.push({
        question_id,
        question_text: question.question_text,
        selectedOption: selectedOption?.option_text || null,
        correct_option: correctOption?.option_text || null,
        is_correct: isCorrect,
      });
    }

    await attempt.update({
      score,
      is_submitted: true,
      submitted_at: new Date(),
    });

    const totalQuestions = attempt.question_set.questions.length;

    res.status(200).json({
      success: true,
      message: "Attempt submitted successfully",
      score,
      total_questions: totalQuestions,
      percentage: score > 0 ? Math.round((score / totalQuestions) * 100) : 0,
      results,
    });
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
