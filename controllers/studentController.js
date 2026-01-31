const {
  QuestionSet,
  Question,
  Option,
  Attempt,
  AttemptAnswer,
} = require("../models");
const { validationResult } = require("express-validator");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1) Load all active question sets with their questions
    const questionSets = await QuestionSet.findAll({
      where: { status: "active" },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id"],
        },
      ],
      order: [
        ["sortOrder", "ASC"],
        ["id", "ASC"],
      ],
    });

    // 2) Load all attempts for this user (newest first), with question set for activity titles
    const attempts = await Attempt.findAll({
      where: { user_id: userId },
      include: [
        {
          model: QuestionSet,
          as: "question_set",
          attributes: ["id", "title"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const attemptsBySet = {};
    attempts.forEach((attempt) => {
      const setId = attempt.question_set_id;
      if (!attemptsBySet[setId]) {
        attemptsBySet[setId] = [];
      }
      attemptsBySet[setId].push(attempt);
    });

    const questionSetsMap = {};
    questionSets.forEach((qs) => {
      questionSetsMap[qs.id] = qs;
    });

    // 3) Build progress per question set
    const completedPercentages = [];

    const questionSetsWithProgress = questionSets.map((qs) => {
      const qsAttempts = attemptsBySet[qs.id] || [];
      const submittedAttempts = qsAttempts.filter(
        (a) => a.is_submitted === true,
      );

      const totalQuestions = Array.isArray(qs.questions)
        ? qs.questions.length
        : 0;

      let progress = {
        questionSetId: qs.id,
        status: "available",
        totalQuestions,
      };

      if (submittedAttempts.length > 0) {
        const latestSubmitted = submittedAttempts[0];
        const percentage =
          totalQuestions > 0
            ? Math.round((latestSubmitted.score / totalQuestions) * 100)
            : 0;

        completedPercentages.push(percentage);

        progress = {
          questionSetId: qs.id,
          status: "completed",
          score: percentage,
          totalQuestions,
          attemptId: latestSubmitted.id,
          completedAt: latestSubmitted.submitted_at,
        };
      } else {
        const inProgressAttempt = qsAttempts.find(
          (a) => a.is_submitted === false,
        );

        if (inProgressAttempt) {
          progress = {
            questionSetId: qs.id,
            status: "in_progress",
            totalQuestions,
            attemptId: inProgressAttempt.id,
          };
        }
      }

      return {
        id: qs.id,
        title: qs.title,
        description: qs.description,
        sortOrder: qs.sortOrder,
        totalQuestions,
        youtubeLink: qs.youtubeLink,
        progress,
      };
    });

    // 4) Apply locking based on sortOrder (prerequisite chain)
    // Only the first non-completed set in sortOrder stays available/in_progress.
    // All later sets become "locked" until previous ones are completed.
    let previousCompleted = true;
    const gatedQuestionSets = questionSetsWithProgress.map((qs) => {
      if (!previousCompleted) {
        return {
          ...qs,
          progress: {
            ...qs.progress,
            status: "locked",
          },
        };
      }

      if (qs.progress.status === "completed") {
        previousCompleted = true;
      } else {
        // First non-completed breaks the chain; it stays available/in_progress,
        // and all following sets will be locked.
        previousCompleted = false;
      }

      return qs;
    });

    const completedQuizzes = gatedQuestionSets.filter(
      (qs) => qs.progress.status === "completed",
    ).length;

    const totalQuizzes = gatedQuestionSets.length;

    const averageScore =
      completedPercentages.length > 0
        ? Math.round(
            completedPercentages.reduce((sum, value) => sum + value, 0) /
              completedPercentages.length,
          )
        : 0;

    const stats = {
      completedQuizzes,
      totalQuizzes,
      averageScore,
      currentStreak: 0,
    };

    // 4) Build recent activity (completed attempts only for now)
    const recentSubmittedAttempts = attempts.filter(
      (a) => a.is_submitted === true,
    );

    return res.status(200).json({
      success: true,
      data: {
        stats,
        questionSets: gatedQuestionSets,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load student dashboard",
      error: error.message,
    });
  }
};

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

// Get all question sets with progress (for question sets list page)
const getQuestionSets = async (req, res) => {
  try {
    const userId = req.user.id;

    // Load all active question sets with their questions
    const questionSets = await QuestionSet.findAll({
      where: { status: "active" },
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id"],
        },
      ],
      order: [
        ["sortOrder", "ASC"],
        ["id", "ASC"],
      ],
    });

    // Load all attempts for this user
    const attempts = await Attempt.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    const attemptsBySet = {};
    attempts.forEach((attempt) => {
      const setId = attempt.question_set_id;
      if (!attemptsBySet[setId]) {
        attemptsBySet[setId] = [];
      }
      attemptsBySet[setId].push(attempt);
    });

    // Build progress per question set
    const questionSetsWithProgress = questionSets.map((qs) => {
      const qsAttempts = attemptsBySet[qs.id] || [];
      const submittedAttempts = qsAttempts.filter(
        (a) => a.is_submitted === true,
      );

      const totalQuestions = Array.isArray(qs.questions)
        ? qs.questions.length
        : 0;

      let progress = {
        questionSetId: qs.id,
        status: "available",
        totalQuestions,
      };

      if (submittedAttempts.length > 0) {
        const latestSubmitted = submittedAttempts[0];
        const percentage =
          totalQuestions > 0
            ? Math.round((latestSubmitted.score / totalQuestions) * 100)
            : 0;

        progress = {
          questionSetId: qs.id,
          status: "completed",
          score: percentage,
          totalQuestions,
          attemptId: latestSubmitted.id,
          completedAt: latestSubmitted.submitted_at,
        };
      } else {
        const inProgressAttempt = qsAttempts.find(
          (a) => a.is_submitted === false,
        );

        if (inProgressAttempt) {
          progress = {
            questionSetId: qs.id,
            status: "in_progress",
            totalQuestions,
            attemptId: inProgressAttempt.id,
          };
        }
      }

      return {
        id: qs.id,
        title: qs.title,
        description: qs.description,
        sortOrder: qs.sortOrder,
        totalQuestions,
        youtubeLink: qs.youtubeLink,
        progress,
      };
    });

    // Apply locking based on sortOrder (prerequisite chain)
    let previousCompleted = true;
    const gatedQuestionSets = questionSetsWithProgress.map((qs) => {
      if (!previousCompleted) {
        return {
          ...qs,
          progress: {
            ...qs.progress,
            status: "locked",
          },
        };
      }

      if (qs.progress.status === "completed") {
        previousCompleted = true;
      } else {
        previousCompleted = false;
      }

      return qs;
    });

    return res.status(200).json({
      success: true,
      data: {
        questionSets: gatedQuestionSets,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load question sets",
      error: error.message,
    });
  }
};

// Get single question set with progress (for detail page)
const getQuestionSetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const questionSet = await QuestionSet.findByPk(id, {
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id"],
        },
      ],
    });

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    if (questionSet.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Question set is not available",
      });
    }

    // Get user's attempts for this question set
    const attempts = await Attempt.findAll({
      where: {
        user_id: userId,
        question_set_id: id,
      },
      order: [["created_at", "DESC"]],
    });

    const totalQuestions = Array.isArray(questionSet.questions)
      ? questionSet.questions.length
      : 0;

    const submittedAttempts = attempts.filter((a) => a.is_submitted === true);
    const inProgressAttempt = attempts.find((a) => a.is_submitted === false);

    let progress = {
      questionSetId: questionSet.id,
      status: "available",
      totalQuestions,
    };

    if (submittedAttempts.length > 0) {
      const latestSubmitted = submittedAttempts[0];
      const percentage =
        totalQuestions > 0
          ? Math.round((latestSubmitted.score / totalQuestions) * 100)
          : 0;

      progress = {
        questionSetId: questionSet.id,
        status: "completed",
        score: percentage,
        totalQuestions,
        attemptId: latestSubmitted.id,
        completedAt: latestSubmitted.submitted_at,
      };
    } else if (inProgressAttempt) {
      progress = {
        questionSetId: questionSet.id,
        status: "in_progress",
        totalQuestions,
        attemptId: inProgressAttempt.id,
      };
    }

    // Check if locked (need to check previous sets)
    const allQuestionSets = await QuestionSet.findAll({
      where: { status: "active" },
      order: [["sortOrder", "ASC"]],
    });

    const currentIndex = allQuestionSets.findIndex(
      (qs) => qs.id === parseInt(id),
    );
    let isLocked = false;

    if (currentIndex > 0) {
      // Check if all previous sets are completed
      for (let i = 0; i < currentIndex; i++) {
        const prevSetId = allQuestionSets[i].id;
        const prevAttempts = await Attempt.findAll({
          where: {
            user_id: userId,
            question_set_id: prevSetId,
            is_submitted: true,
          },
        });

        if (prevAttempts.length === 0) {
          isLocked = true;
          break;
        }
      }

      if (isLocked) {
        progress = {
          ...progress,
          status: "locked",
        };
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        id: questionSet.id,
        title: questionSet.title,
        description: questionSet.description,
        sortOrder: questionSet.sortOrder,
        totalQuestions,
        youtubeLink: questionSet.youtubeLink,
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load question set",
      error: error.message,
    });
  }
};

// Get or create attempt for practice (returns questions)
const getOrCreateAttempt = async (req, res) => {
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
        order: [["id", "ASC"]],
      },
    });

    if (!questionSet) {
      return res.status(404).json({
        success: false,
        message: "Question set not found",
      });
    }

    if (questionSet.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Question set is not available",
      });
    }

    // Check for existing in-progress attempt
    let attempt = await Attempt.findOne({
      where: {
        user_id: userId,
        question_set_id: setId,
        is_submitted: false,
      },
    });

    if (!attempt) {
      // Create new attempt
      attempt = await Attempt.create({
        user_id: userId,
        question_set_id: setId,
      });
    }

    // Format questions for frontend
    const questions = questionSet.questions.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options.map((opt) => ({
        id: opt.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      })),
    }));

    // Get existing answers if any
    const existingAnswers = await AttemptAnswer.findAll({
      where: { attempt_id: attempt.id },
    });

    const answersMap = {};
    existingAnswers.forEach((ans) => {
      answersMap[ans.question_id] = ans.selected_option_id;
    });

    return res.status(200).json({
      success: true,
      data: {
        attempt: {
          id: attempt.id,
          questionSetId: questionSet.id,
          userId: userId,
          status: attempt.is_submitted ? "submitted" : "in_progress",
          totalQuestions: questions.length,
          startedAt: attempt.created_at,
        },
        questionSet: {
          id: questionSet.id,
          title: questionSet.title,
        },
        questions,
        existingAnswers: answersMap,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get or create attempt",
      error: error.message,
    });
  }
};

// Get attempt result with all answers
const getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    const attempt = await Attempt.findOne({
      where: { id: attemptId, user_id: userId },
      include: {
        model: QuestionSet,
        as: "question_set",
        include: {
          model: Question,
          as: "questions",
          include: {
            model: Option,
            as: "options",
          },
        },
      },
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    if (!attempt.is_submitted) {
      return res.status(400).json({
        success: false,
        message: "Attempt has not been submitted yet",
      });
    }

    // Get all answers for this attempt
    const attemptAnswers = await AttemptAnswer.findAll({
      where: { attempt_id: attemptId },
    });

    const answersMap = {};
    attemptAnswers.forEach((ans) => {
      answersMap[ans.question_id] = ans;
    });

    // Build result with all question details
    const answers = attempt.question_set.questions.map((question) => {
      const answer = answersMap[question.id];
      const correctOption = question.options.find((opt) => opt.is_correct);

      return {
        questionId: question.id,
        questionText: question.question_text,
        questionType: question.question_type,
        selectedOptionId: answer?.selected_option_id || null,
        correctOptionId: correctOption?.id || null,
        isCorrect: answer?.is_correct || false,
        options: question.options.map((opt) => ({
          id: opt.id,
          text: opt.option_text,
          isCorrect: opt.is_correct,
        })),
      };
    });

    const totalQuestions = attempt.question_set.questions.length;
    const correctAnswers = attempt.score;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return res.status(200).json({
      success: true,
      data: {
        attemptId: attempt.id,
        score: correctAnswers,
        totalQuestions,
        correctAnswers,
        percentage,
        passed: percentage >= 70,
        submittedAt: attempt.submitted_at,
        answers,
        questionSet: {
          id: attempt.question_set.id,
          title: attempt.question_set.title,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load attempt result",
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
        (opt) => opt.id === selected_option_id,
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
    const percentage = Math.round((score / totalQuestions) * 100);

    return res.status(200).json({
      success: true,
      message: "Attempt submitted successfully",
      data: {
        attemptId: attempt.id,
        score,
        totalQuestions,
        correctAnswers: score,
        percentage,
        passed: percentage >= 70,
        submittedAt: attempt.submitted_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit attempt",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getQuestionSets,
  getQuestionSetById,
  getOrCreateAttempt,
  getAttemptResult,
  startAttempt,
  submitAttempt,
};
