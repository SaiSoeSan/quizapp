const LIMITS = {
  title: 200,
  topic: 200,
  question: 500,
  option: 200,
  explanation: 1000,
};

const cleanString = (value, maxLength) =>
  typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";

const validateQuizOutput = (output, expected) => {
  if (!output || typeof output !== "object" || Array.isArray(output)) {
    return { valid: false, data: null };
  }

  const { topic, numberOfQuestions, difficulty } = expected;
  if (
    !Array.isArray(output.questions) ||
    output.questions.length !== numberOfQuestions
  ) {
    return { valid: false, data: null };
  }

  const questions = [];

  for (const item of output.questions) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { valid: false, data: null };
    }

    const question = cleanString(item.question, LIMITS.question);
    const explanation = cleanString(item.explanation, LIMITS.explanation);

    if (
      !question ||
      !explanation ||
      !Array.isArray(item.options) ||
      item.options.length !== 4
    ) {
      return { valid: false, data: null };
    }

    const options = item.options.map((option) =>
      cleanString(option, LIMITS.option),
    );

    if (options.some((option) => !option)) {
      return { valid: false, data: null };
    }

    const uniqueOptions = new Set(
      options.map((option) => option.toLocaleLowerCase()),
    );
    if (uniqueOptions.size !== 4) {
      return { valid: false, data: null };
    }

    const correctAnswer = cleanString(item.correctAnswer, LIMITS.option);
    if (
      !correctAnswer ||
      !options.some((option) => option === correctAnswer)
    ) {
      return { valid: false, data: null };
    }

    questions.push({
      question,
      options,
      correctAnswer,
      explanation,
    });
  }

  return {
    valid: true,
    data: {
      title: topic,
      topic,
      difficulty,
      questions,
    },
  };
};

module.exports = {
  LIMITS,
  validateQuizOutput,
};
