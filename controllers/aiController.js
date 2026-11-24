const { validationResult } = require("express-validator");
const aiService = require("../services/aiService");
const {
  validateQuizOutput,
} = require("../validators/quizOutputValidator");

const logOutcome = (req, outcome, errorCode = null) => {
  const entry = {
    outcome,
    errorCode,
    requestId: req.requestId || null,
  };
  if (outcome === "success") {
    console.info(JSON.stringify(entry));
  } else {
    console.warn(JSON.stringify(entry));
  }
};

const chat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logOutcome(req, "validation_failed", "AI_INPUT_VALIDATION");
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  try {
    const message = req.body.message.trim();
    const responseMessage = await aiService.createChatCompletion(message);

    logOutcome(req, "success");
    return res.status(200).json({
      success: true,
      data: { message: responseMessage },
    });
  } catch (error) {
    const status = error?.status || 502;
    logOutcome(req, "provider_failed", error?.code || "AI_PROVIDER_FAILURE");
    const message =
      status === 503
        ? error.code === aiService.AI_ERROR_CODES.MISSING_CONFIG
          ? "AI service is not configured"
          : "AI service is temporarily unavailable"
        : status === 504
          ? "AI service timed out"
          : "AI service failed to produce a valid response";

    return res.status(status).json({
      success: false,
      message,
      errors: [],
    });
  }
};

const generateQuiz = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logOutcome(req, "validation_failed", "AI_INPUT_VALIDATION");
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  try {
    const topic = req.body.topic.trim();
    const numberOfQuestions = Number(req.body.numberOfQuestions);
    const difficulty = req.body.difficulty.trim();

    const modelOutput = await aiService.createQuizCompletion({
      topic,
      numberOfQuestions,
      difficulty,
    });

    const validation = validateQuizOutput(modelOutput, {
      topic,
      numberOfQuestions,
      difficulty,
    });

    if (!validation.valid) {
      logOutcome(req, "provider_failed", "AI_MALFORMED_OUTPUT");
      return res.status(502).json({
        success: false,
        message: "AI service failed to produce a valid response",
        errors: [],
      });
    }

    logOutcome(req, "success");
    return res.status(200).json({
      success: true,
      data: validation.data,
    });
  } catch (error) {
    const status = error?.status || 502;
    logOutcome(req, "provider_failed", error?.code || "AI_PROVIDER_FAILURE");
    const message =
      status === 503
        ? error.code === aiService.AI_ERROR_CODES.MISSING_CONFIG
          ? "AI service is not configured"
          : "AI service is temporarily unavailable"
        : status === 504
          ? "AI service timed out"
          : "AI service failed to produce a valid response";

    return res.status(status).json({
      success: false,
      message,
      errors: [],
    });
  }
};

module.exports = {
  chat,
  generateQuiz,
};
