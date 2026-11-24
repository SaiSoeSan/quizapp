const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz App API",
      version: "1.0.0",
      description: "API documentation for the Quiz Application",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AIChatSuccess: {
          type: "object",
          required: ["success", "data"],
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              required: ["message"],
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
        AIQuizQuestion: {
          type: "object",
          required: ["question", "options", "correctAnswer", "explanation"],
          properties: {
            question: { type: "string" },
            options: {
              type: "array",
              minItems: 4,
              maxItems: 4,
              items: { type: "string" },
            },
            correctAnswer: { type: "string" },
            explanation: { type: "string" },
          },
        },
        AIQuizSuccess: {
          type: "object",
          required: ["success", "data"],
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              required: ["title", "topic", "difficulty", "questions"],
              properties: {
                title: { type: "string" },
                topic: { type: "string" },
                difficulty: {
                  type: "string",
                  enum: ["beginner", "intermediate", "advanced"],
                },
                questions: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AIQuizQuestion" },
                },
              },
            },
          },
        },
        AIError: {
          type: "object",
          required: ["success", "message", "errors"],
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: {
              type: "array",
              items: { type: "object" },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

module.exports = swaggerConfig;
