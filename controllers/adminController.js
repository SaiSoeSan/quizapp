const { QuestionSet, Question, Option, User } = require("../models");
const { validationResult } = require("express-validator");
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");

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
    const { title, description, youtubeLink, status } = req.body;

    // sort order logic auto generate, max sort order + 1
    let sortOrder = 1;
    const maxSortOrder = await QuestionSet.max("sortOrder");
    if (maxSortOrder) {
      sortOrder = maxSortOrder + 1;
    }

    const newQuestionSet = await QuestionSet.create({
      title,
      description,
      youtubeLink,
      status,
      sortOrder,
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
    const questionSets = await QuestionSet.findAll({
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("questions.id")),
            "questionCount",
          ],
        ],
      },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: [],
        },
      ],
      group: ["QuestionSet.id"],
      order: [["createdAt", "DESC"]],
    });
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
 * Get A question set by ID
 */

const getQuestionSetById = async (req, res) => {
  try {
    const { id } = req.params;
    // get a question set by id including questions and options
    const questionSetWithDetails = await QuestionSet.findByPk(id, {
      include: {
        model: Question,
        as: "questions",
        include: {
          model: Option,
          as: "options",
        },
      },
    });
    if (!questionSetWithDetails) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    res.status(200).json({
      success: true,
      questionSet: questionSetWithDetails,
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
    const { title, description, youtubeLink, status } = req.body;

    const questionSet = await QuestionSet.findByPk(id);

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    questionSet.title = title || questionSet.title;
    questionSet.description = description || questionSet.description;
    questionSet.youtubeLink = youtubeLink || questionSet.youtubeLink;
    questionSet.status = status || questionSet.status;
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

/**
 * Create a question in a question set
 */
const createQuestion = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const t = await sequelize.transaction();

  try {
    const { setId } = req.params;
    const { questionText, questionType, options } = req.body;

    const questionSet = await QuestionSet.findByPk(setId);
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    const newQuestion = await Question.create(
      {
        questionSetId: setId,
        questionText,
        questionType,
      },
      { transaction: t },
    );

    for (const option of options) {
      await Option.create(
        {
          questionId: newQuestion.id,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        },
        { transaction: t },
      );
    }

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion,
    });
    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all question by question set ID
 */
const getQuestionsBySetId = async (req, res) => {
  try {
    const { setId } = req.params;

    const questionSet = await QuestionSet.findByPk(setId);
    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    const questions = await Question.findAll({
      where: { questionSetId: setId },
      include: { model: Option, as: "options" },
    });

    res.status(200).json({
      success: true,
      questions,
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
 * Update a question in a question set
 */

const updateQuestion = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const { setId, questionId } = req.params;
      const { questionText, questionType, options } = req.body;

      const questionSet = await QuestionSet.findByPk(setId);
      if (!questionSet) {
        return res.status(404).json({
          success: false,
          message: "Question set not found",
        });
      }

      const question = await Question.findOne({
        where: { id: questionId, questionSetId: setId },
      });

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      question.questionText = questionText;
      question.questionType = questionType;
      await question.save({ transaction: t });

      await Option.destroy({
        where: { questionId: questionId },
        force: true,
        individualHooks: true,
        transaction: t,
      });

      for (const option of options) {
        await Option.create(
          {
            questionId: questionId,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          },
          { transaction: t },
        );
      }

      res.status(200).json({
        success: true,
        message: "Question updated successfully",
        question,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/** Delete a question in a question set */
const deleteQuestion = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { setId, questionId } = req.params;

    const questionSet = await QuestionSet.findByPk(setId);

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    const question = await Question.findOne({
      where: { id: questionId, questionSetId: setId },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await question.destroy({
      individualHooks: true,
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/**
 * Get all students (users with role 'student')
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: "student" },
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      success: true,
      users: students,
      total: students.length,
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
 * Get a user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
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
 * Update a user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    await user.save();

    // Exclude password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
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
 * Delete a user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin users
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    await user.destroy();
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
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
 * Create a new student
 */
const createStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = await User.create({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      role: "student",
    });

    // Exclude password from response
    const userResponse = newStudent.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      user: userResponse,
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
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionSetById,
  getQuestionsBySetId,
  getAllStudents,
  getUserById,
  updateUser,
  deleteUser,
  createStudent,
};
