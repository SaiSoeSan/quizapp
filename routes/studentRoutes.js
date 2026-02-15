const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { body } = require("express-validator");
const { authenticate, studentOnly } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student endpoints
 */

router.use([authenticate, studentOnly]);

const submitAttemptValidationRules = [
  body("answers").isArray().withMessage("Answers must be an array"),
  body("answers.*.questionId")
    .isInt()
    .withMessage("Question ID must be an integer"),
  body("answers.*.selectedOptionId")
    .isInt()
    .withMessage("Selected option ID must be an integer"),
];

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get student dashboard overview
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with stats and question sets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         completedQuizzes:
 *                           type: integer
 *                         totalQuizzes:
 *                           type: integer
 *                         averageScore:
 *                           type: integer
 *                         currentStreak:
 *                           type: integer
 *                     questionSets:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Failed to load student dashboard
 */
// Student dashboard overview
router.get("/dashboard", studentController.getDashboard);

/**
 * @swagger
 * /api/student/question-sets:
 *   get:
 *     summary: Get all question sets with progress
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of question sets with student progress (locked/available/in_progress/completed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     questionSets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           sortOrder:
 *                             type: integer
 *                           totalQuestions:
 *                             type: integer
 *                           youtubeLink:
 *                             type: string
 *                           progress:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                                 enum: [locked, available, in_progress, completed]
 *       500:
 *         description: Failed to load question sets
 */
// Get all question sets with progress
router.get("/question-sets", studentController.getQuestionSets);

/**
 * @swagger
 * /api/student/question-sets/{id}:
 *   get:
 *     summary: Get single question set by ID with progress
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question set ID
 *     responses:
 *       200:
 *         description: Question set details with progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     sortOrder:
 *                       type: integer
 *                     totalQuestions:
 *                       type: integer
 *                     youtubeLink:
 *                       type: string
 *                     progress:
 *                       type: object
 *       403:
 *         description: Question set is not available (inactive)
 *       404:
 *         description: Question set not found
 *       500:
 *         description: Failed to load question set
 */
// Get single question set by ID
router.get("/question-sets/:id", studentController.getQuestionSetById);

/**
 * @swagger
 * /api/student/question-sets/{setId}/attempt:
 *   get:
 *     summary: Get or create attempt for practice (returns questions)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question set ID
 *     responses:
 *       200:
 *         description: Attempt with questions and existing answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     attempt:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         questionSetId:
 *                           type: integer
 *                         userId:
 *                           type: integer
 *                         status:
 *                           type: string
 *                         totalQuestions:
 *                           type: integer
 *                         startedAt:
 *                           type: string
 *                           format: date-time
 *                     questionSet:
 *                       type: object
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     existingAnswers:
 *                       type: object
 *       403:
 *         description: Question set is not available (inactive)
 *       404:
 *         description: Question set not found
 *       500:
 *         description: Failed to get or create attempt
 *   post:
 *     summary: Start a new attempt (legacy endpoint)
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question set ID
 *     responses:
 *       201:
 *         description: New attempt created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 attempt:
 *                   type: object
 *       404:
 *         description: Question set not found
 *       500:
 *         description: Failed to start attempt
 */
// Get or create attempt for practice (returns questions)
router.get(
  "/question-sets/:setId/attempt",
  studentController.getOrCreateAttempt,
);

// Start a new attempt (legacy endpoint, kept for compatibility)
router.post("/question-sets/:setId/attempt", studentController.startAttempt);

/**
 * @swagger
 * /api/student/attempt/{attemptId}/result:
 *   get:
 *     summary: Get attempt result with answers
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Attempt result with score and answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     attemptId:
 *                       type: integer
 *                     score:
 *                       type: integer
 *                     totalQuestions:
 *                       type: integer
 *                     correctAnswers:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                     passed:
 *                       type: boolean
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                     questionSet:
 *                       type: object
 *       400:
 *         description: Attempt has not been submitted yet
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Failed to load attempt result
 */
// Get attempt result
router.get("/attempt/:attemptId/result", studentController.getAttemptResult);

/**
 * @swagger
 * /api/student/attempt/{attemptId}/submit:
 *   post:
 *     summary: Submit an attempt
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attempt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - selectedOptionId
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       description: Question ID
 *                     selectedOptionId:
 *                       type: integer
 *                       description: Selected option ID
 *     responses:
 *       200:
 *         description: Attempt submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     attemptId:
 *                       type: integer
 *                     score:
 *                       type: integer
 *                     totalQuestions:
 *                       type: integer
 *                     correctAnswers:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                     passed:
 *                       type: boolean
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error or attempt already submitted
 *       404:
 *         description: Attempt not found
 *       500:
 *         description: Failed to submit attempt
 */
// Submit an attempt
router.post(
  "/attempt/:attemptId/submit",
  submitAttemptValidationRules,
  studentController.submitAttempt,
);

module.exports = router;
