const { QuestionSet, Question, Option } = require("../models");
const { validationResult } = require("express-validator");

/**
 * Create a new question set
 */

const createQuestionSet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { title, description, youtube_link } = req.body;

    const newQuestionSet = await QuestionSet.create({
      title,
      description,
      youtube_link,
    });

    res.status(201).json({
      success: true,
      message: "Question set created successfully",
      questionSet: newQuestionSet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all question sets
 */

const getAllQuestionSets = async (req, res) => {
  try {
    const questionSets = await QuestionSet.findAll();
    res.status(200).json({
      success: true,
      questionSets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Delete a question set
 */

const deleteQuestionSet = async (req, res) => {
  try {
    const { id } = req.params;
    const questionSet = await QuestionSet.findByPk(id);
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    await questionSet.destroy();
    res.status(200).json({
      success: true,
      message: "Question set deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Update a question set
 */
const updateQuestionSet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { id } = req.params;
    const { title, description, youtube_link } = req.body;

    const questionSet = await QuestionSet.findByPk(id);
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    questionSet.title = title;
    questionSet.description = description;
    questionSet.youtube_link = youtube_link;
    await questionSet.save();

    res.status(200).json({
      success: true,
      message: "Question set updated successfully",
      questionSet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createQuestionSet,
  getAllQuestionSets,
  deleteQuestionSet,
  updateQuestionSet,
};
