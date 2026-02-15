const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const admin = require("../controllers/adminController");
const { authenticate, adminOnly } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

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

/**
 * @swagger
 * /api/admin/question-sets:
 *   post:
 *     summary: Create a new question set
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Question set title
 *               description:
 *                 type: string
 *                 description: Question set description (optional)
 *               youtubeLink:
 *                 type: string
 *                 format: uri
 *                 description: YouTube video link (optional)
 *               status:
 *                 type: string
 *                 enum: [draft, active]
 *                 description: Question set status (optional)
 *     responses:
 *       201:
 *         description: Question set created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 questionSet:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all question sets
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of question sets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questionSets:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
// Question Set routes
router.post(
  "/question-sets",
  createQuestionSetValidationRules,
  admin.createQuestionSet,
);
router.get("/question-sets", admin.getAllQuestionSets);

/**
 * @swagger
 * /api/admin/question-sets/{id}:
 *   get:
 *     summary: Get question set by ID with questions and options
 *     tags: [Admin]
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
 *         description: Question set details with questions and options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questionSet:
 *                   type: object
 *       404:
 *         description: Question set not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update question set
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               youtubeLink:
 *                 type: string
 *                 format: uri
 *               status:
 *                 type: string
 *                 enum: [draft, active]
 *     responses:
 *       200:
 *         description: Question set updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 questionSet:
 *                   type: object
 *       404:
 *         description: Question set not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete question set
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question set deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Question set not found
 *       500:
 *         description: Server error
 */
router.get("/question-sets/:id", admin.getQuestionSetById);
router.delete("/question-sets/:id", admin.deleteQuestionSet);
router.put(
  "/question-sets/:id",
  createQuestionSetValidationRules,
  admin.updateQuestionSet,
);

/**
 * @swagger
 * /api/admin/question-sets/{setId}/questions:
 *   post:
 *     summary: Create a question in a question set
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question set ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText
 *               - questionType
 *               - options
 *             properties:
 *               questionText:
 *                 type: string
 *                 description: The question text
 *               questionType:
 *                 type: string
 *                 enum: [multiple_choice, true_false]
 *                 description: Type of question
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   required:
 *                     - optionText
 *                     - isCorrect
 *                   properties:
 *                     optionText:
 *                       type: string
 *                       description: The option text
 *                     isCorrect:
 *                       type: boolean
 *                       description: Whether this option is correct
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 question:
 *                   type: object
 *       404:
 *         description: Question set not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all questions in a question set
 *     tags: [Admin]
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
 *         description: List of questions with options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Question set not found
 *       500:
 *         description: Server error
 */
// Create Question routes
router.post(
  "/question-sets/:setId/questions",
  createQuestionValidationRules,
  admin.createQuestion,
);
router.get("/question-sets/:setId/questions", admin.getQuestionsBySetId);

/**
 * @swagger
 * /api/admin/question-sets/{setId}/questions/{questionId}:
 *   put:
 *     summary: Update a question
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question set ID
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText
 *               - questionType
 *               - options
 *             properties:
 *               questionText:
 *                 type: string
 *                 description: The question text
 *               questionType:
 *                 type: string
 *                 enum: [multiple_choice, true_false]
 *                 description: Type of question
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   required:
 *                     - optionText
 *                     - isCorrect
 *                   properties:
 *                     optionText:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 question:
 *                   type: object
 *       404:
 *         description: Question set or question not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a question
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question set ID
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Question set or question not found
 *       500:
 *         description: Server error
 */
router.put(
  "/question-sets/:setId/questions/:questionId",
  createQuestionValidationRules,
  admin.updateQuestion,
);
router.delete(
  "/question-sets/:setId/questions/:questionId",
  admin.deleteQuestion,
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all students
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students (password excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new student
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Student's first name
 *               lastName:
 *                 type: string
 *                 description: Student's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Student's email address
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Student's password (min 6 characters)
 *               phone:
 *                 type: string
 *                 description: Student's phone number (optional)
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
// User management routes
router.get("/users", admin.getAllStudents);
router.post("/users", createStudentValidationRules, admin.createStudent);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details (password excluded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: Cannot delete admin users
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/users/:id", admin.getUserById);
router.put("/users/:id", admin.updateUser);
router.delete("/users/:id", admin.deleteUser);

/**
 * @swagger
 * /api/admin/attempts/stats:
 *   get:
 *     summary: Get attempt statistics and recent attempts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total attempts count and recent 5 attempts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalAttempts:
 *                   type: integer
 *                   description: Total number of submitted attempts
 *                 recentAttempts:
 *                   type: array
 *                   maxItems: 5
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       score:
 *                         type: integer
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                       questionSet:
 *                         type: object
 *       500:
 *         description: Server error
 *
 * /api/admin/attempts:
 *   get:
 *     summary: Get all attempts with stats grouped by question set
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all attempts with percentage and question set stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 attempts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       questionSetId:
 *                         type: integer
 *                       score:
 *                         type: integer
 *                       totalQuestions:
 *                         type: integer
 *                       percentage:
 *                         type: integer
 *                       isSubmitted:
 *                         type: boolean
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                       questionSet:
 *                         type: object
 *                 questionSetStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionSetId:
 *                         type: integer
 *                       totalAttempts:
 *                         type: integer
 *                       totalQuestions:
 *                         type: integer
 *                       averageScore:
 *                         type: integer
 *                       questionSet:
 *                         type: object
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
// Attempt management routes
router.get("/attempts/stats", admin.getAttemptStats);
router.get("/attempts", admin.getAllAttempts);

module.exports = router;
