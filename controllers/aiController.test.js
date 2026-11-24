const request = require("supertest");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

jest.mock("../models", () => ({
  User: { findByPk: jest.fn() },
}));

jest.mock("../services/aiService", () => ({
  AI_ERROR_CODES: {
    MISSING_CONFIG: "AI_MISSING_CONFIG",
  },
  createChatCompletion: jest.fn(),
  createQuizCompletion: jest.fn(),
}));

const app = require("../app");
const aiService = require("../services/aiService");
const authMiddleware = require("../middleware/auth");
const { User } = require("../models");

const token = () => authMiddleware.generateToken(123);

beforeEach(() => {
  User.findByPk.mockResolvedValue({ id: 123, role: "student" });
});

describe("POST /api/ai/chat", () => {
  beforeEach(() => {
    aiService.createChatCompletion.mockReset();
  });

  it("returns a successful Claude chat response", async () => {
    aiService.createChatCompletion.mockResolvedValue(
      "Artificial intelligence is...",
    );

    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "Explain artificial intelligence" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { message: "Artificial intelligence is..." },
    });
  });

  it("rejects a missing message", async () => {
    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({});

    expect(response.status).toBe(422);
    expect(aiService.createChatCompletion).not.toHaveBeenCalled();
  });

  it("rejects an empty message", async () => {
    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "   " });

    expect(response.status).toBe(422);
    expect(aiService.createChatCompletion).not.toHaveBeenCalled();
  });

  it("rejects an overlong message", async () => {
    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "x".repeat(4001) });

    expect(response.status).toBe(422);
    expect(aiService.createChatCompletion).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated chat requests", async () => {
    const response = await request(app)
      .post("/api/ai/chat")
      .send({ message: "Hello" });

    expect(response.status).toBe(401);
  });

  it("returns 503 when Claude is not configured", async () => {
    aiService.createChatCompletion.mockRejectedValue({
      code: "AI_MISSING_CONFIG",
      status: 503,
    });

    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "Hello" });

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      success: false,
      message: "AI service is not configured",
      errors: [],
    });
  });

  it("returns 502 for provider failures", async () => {
    aiService.createChatCompletion.mockRejectedValue({
      code: "AI_PROVIDER_FAILURE",
      status: 502,
    });

    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "Hello" });

    expect(response.status).toBe(502);
  });

  it("returns 504 for timeouts", async () => {
    aiService.createChatCompletion.mockRejectedValue({
      code: "AI_TIMEOUT",
      status: 504,
    });

    const response = await request(app)
      .post("/api/ai/chat")
      .set("Authorization", `Bearer ${token()}`)
      .send({ message: "Hello" });

    expect(response.status).toBe(504);
  });

  it("rate limits chat requests", async () => {
    aiService.createChatCompletion.mockResolvedValue("Hello");

    let lastResponse;
    for (let i = 0; i < 21; i += 1) {
      lastResponse = await request(app)
        .post("/api/ai/chat")
        .set("Authorization", `Bearer ${token()}`)
        .send({ message: "Hello" });
    }

    expect(lastResponse.status).toBe(429);
  });
});

describe("POST /api/ai/generate-quiz", () => {
  beforeEach(() => {
    aiService.createQuizCompletion.mockReset();
  });

  it("rejects an invalid topic", async () => {
    const response = await request(app)
      .post("/api/ai/generate-quiz")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        topic: "",
        numberOfQuestions: 5,
        difficulty: "beginner",
      });

    expect(response.status).toBe(422);
    expect(aiService.createQuizCompletion).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated quiz generation", async () => {
    const response = await request(app)
      .post("/api/ai/generate-quiz")
      .send({
        topic: "JavaScript Fundamentals",
        numberOfQuestions: 5,
        difficulty: "beginner",
      });

    expect(response.status).toBe(401);
    expect(aiService.createQuizCompletion).not.toHaveBeenCalled();
  });

  it("rejects an invalid difficulty", async () => {
    const response = await request(app)
      .post("/api/ai/generate-quiz")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        topic: "JavaScript Fundamentals",
        numberOfQuestions: 5,
        difficulty: "expert",
      });

    expect(response.status).toBe(422);
  });

  it.each([0, 21, 2.5, "5"])(
    "rejects invalid numberOfQuestions value %p",
    async (numberOfQuestions) => {
      const response = await request(app)
        .post("/api/ai/generate-quiz")
        .set("Authorization", `Bearer ${token()}`)
        .send({
          topic: "JavaScript Fundamentals",
          numberOfQuestions,
          difficulty: "beginner",
        });

      expect(response.status).toBe(422);
      expect(aiService.createQuizCompletion).not.toHaveBeenCalled();
    },
  );

  it("returns a validated generated quiz", async () => {
    aiService.createQuizCompletion.mockResolvedValue({
      title: "Ignored model title",
      topic: "Ignored model topic",
      difficulty: "advanced",
      unknownField: "removed",
      questions: [
        {
          question: "Which keyword can be reassigned?",
          options: ["const", "let", "class", "import"],
          correctAnswer: "let",
          explanation: "let declares a reassignable variable.",
          unknownField: "removed",
        },
      ],
    });

    const response = await request(app)
      .post("/api/ai/generate-quiz")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        topic: "JavaScript Fundamentals",
        numberOfQuestions: 1,
        difficulty: "beginner",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        title: "JavaScript Fundamentals",
        topic: "JavaScript Fundamentals",
        difficulty: "beginner",
        questions: [
          {
            question: "Which keyword can be reassigned?",
            options: ["const", "let", "class", "import"],
            correctAnswer: "let",
            explanation: "let declares a reassignable variable.",
          },
        ],
      },
    });
  });

  it("returns 502 for invalid generated quiz data", async () => {
    aiService.createQuizCompletion.mockResolvedValue({
      questions: [
        {
          question: "Question",
          options: ["A", "A", "C", "D"],
          correctAnswer: "A",
          explanation: "Explanation",
        },
      ],
    });

    const response = await request(app)
      .post("/api/ai/generate-quiz")
      .set("Authorization", `Bearer ${token()}`)
      .send({
        topic: "JavaScript Fundamentals",
        numberOfQuestions: 1,
        difficulty: "beginner",
      });

    expect(response.status).toBe(502);
    expect(response.body).toEqual({
      success: false,
      message: "AI service failed to produce a valid response",
      errors: [],
    });
  });

  it("rate limits quiz generation requests", async () => {
    aiService.createQuizCompletion.mockResolvedValue({
      questions: [
        {
          question: "Question",
          options: ["A", "B", "C", "D"],
          correctAnswer: "A",
          explanation: "Explanation",
        },
      ],
    });

    let lastResponse;
    for (let i = 0; i < 11; i += 1) {
      lastResponse = await request(app)
        .post("/api/ai/generate-quiz")
        .set("Authorization", `Bearer ${token()}`)
        .send({
          topic: "JavaScript Fundamentals",
          numberOfQuestions: 1,
          difficulty: "beginner",
        });
    }

    expect(lastResponse.status).toBe(429);
  });
});
