const { validateQuizOutput } = require("./quizOutputValidator");

const validOutput = (overrides = {}) => ({
  title: "JavaScript Fundamentals",
  topic: "Ignored model topic",
  difficulty: "advanced",
  unknownField: "strip me",
  questions: [
    {
      question: "Which keyword can be reassigned?",
      options: ["const", "let", "class", "import"],
      correctAnswer: "let",
      explanation: "let declares a reassignable variable.",
      unknownField: "strip me",
    },
  ],
  ...overrides,
});

describe("validateQuizOutput", () => {
  const expected = {
    topic: "JavaScript Fundamentals",
    numberOfQuestions: 1,
    difficulty: "beginner",
  };

  it("returns only the approved quiz shape", () => {
    const result = validateQuizOutput(validOutput(), expected);

    expect(result.valid).toBe(true);
    expect(result.data).toEqual({
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
    });
  });

  it("rejects the wrong question count", () => {
    expect(
      validateQuizOutput(
        validOutput({ questions: [] }),
        expected,
      ).valid,
    ).toBe(false);
  });

  it("rejects the wrong option count", () => {
    const output = validOutput();
    output.questions[0].options = ["let", "const", "var"];

    expect(validateQuizOutput(output, expected).valid).toBe(false);
  });

  it("rejects duplicate options case-insensitively", () => {
    const output = validOutput();
    output.questions[0].options = ["let", "Let", "const", "var"];

    expect(validateQuizOutput(output, expected).valid).toBe(false);
  });

  it("rejects a correctAnswer outside the options", () => {
    const output = validOutput();
    output.questions[0].correctAnswer = "missing";

    expect(validateQuizOutput(output, expected).valid).toBe(false);
  });

  it("rejects missing question or explanation text", () => {
    const missingQuestion = validOutput();
    missingQuestion.questions[0].question = " ";

    const missingExplanation = validOutput();
    missingExplanation.questions[0].explanation = "";

    expect(validateQuizOutput(missingQuestion, expected).valid).toBe(false);
    expect(validateQuizOutput(missingExplanation, expected).valid).toBe(false);
  });
});
