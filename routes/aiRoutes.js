const express = require("express");
const { body } = require("express-validator");
const { randomUUID } = require("node:crypto");
const rateLimit = require("express-rate-limit");
const aiController = require("../controllers/aiController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use((req, res, next) => {
  req.requestId = req.headers["x-request-id"] || randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

router.use(authenticate);

const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: Number.parseInt(process.env.AI_CHAT_RATE_LIMIT_MAX, 10) || 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => `user:${req.user.id}`,
  handler: (req, res) => {
    console.warn(
      JSON.stringify({
        outcome: "rate_limited",
        errorCode: "AI_RATE_LIMIT",
        requestId: req.requestId,
      }),
    );
    return res.status(429).json({
      success: false,
      message: "Too many AI chat requests",
      errors: [],
    });
  },
});

const quizRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: Number.parseInt(process.env.AI_QUIZ_RATE_LIMIT_MAX, 10) || 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => `user:${req.user.id}`,
  handler: (req, res) => {
    console.warn(
      JSON.stringify({
        outcome: "rate_limited",
        errorCode: "AI_RATE_LIMIT",
        requestId: req.requestId,
      }),
    );
    return res.status(429).json({
      success: false,
      message: "Too many AI quiz generation requests",
      errors: [],
    });
  },
});

const chatValidationRules = [
  body("message")
    .isString()
    .withMessage("Message must be a string")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 4000 })
    .withMessage("Message must be 4000 characters or fewer"),
];

const generateQuizValidationRules = [
  body("topic")
    .isString()
    .withMessage("Topic must be a string")
    .trim()
    .notEmpty()
    .withMessage("Topic is required")
    .isLength({ max: 200 })
    .withMessage("Topic must be 200 characters or fewer"),
  body("numberOfQuestions")
    .custom(
      (value) =>
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 20,
    )
    .withMessage("Number of questions must be an integer from 1 to 20"),
  body("difficulty")
    .isString()
    .withMessage("Difficulty must be a string")
    .trim()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage(
      "Difficulty must be beginner, intermediate, or advanced",
    ),
];

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: Claude-powered AI endpoints
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send a message to Claude
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 4000
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIChatSuccess"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       429:
 *         description: Too many chat requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       502:
 *         description: AI provider or output failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       503:
 *         description: AI service not configured or rate limited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       504:
 *         description: AI service timeout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 */
router.post("/chat", chatRateLimit, chatValidationRules, aiController.chat);

/**
 * @swagger
 * /api/ai/generate-quiz:
 *   post:
 *     summary: Generate a structured quiz with Claude
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [topic, numberOfQuestions, difficulty]
 *             properties:
 *               topic:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               numberOfQuestions:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *     responses:
 *       200:
 *         description: Validated generated quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIQuizSuccess"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       429:
 *         description: Too many quiz generation requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       502:
 *         description: AI provider or output failure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       503:
 *         description: AI service not configured or rate limited
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 *       504:
 *         description: AI service timeout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIError"
 */
router.post(
  "/generate-quiz",
  quizRateLimit,
  generateQuizValidationRules,
  aiController.generateQuiz,
);

module.exports = router;
