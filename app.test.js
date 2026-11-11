const request = require("supertest");
const bcrypt = require("bcrypt");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

const users = {
  admin: {
    id: 1,
    email: "admin@example.com",
    password: "AdminPassword123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  student: {
    id: 2,
    email: "student@example.com",
    password: "StudentPassword123",
    firstName: "Student",
    lastName: "User",
    role: "student",
  },
};

const mockModelMethods = {
  User: {
    findByEmail: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
  QuestionSet: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    max: jest.fn(),
    create: jest.fn(),
  },
  Question: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Option: {
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Attempt: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  AttemptAnswer: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock("./models", () => ({
  ...Object.fromEntries(
    Object.entries(mockModelMethods).map(([name, methods]) => [
      name,
      Object.fromEntries(
        Object.entries(methods).map(([method, implementation]) => [
          method,
          implementation,
        ]),
      ),
    ]),
  ),
  sequelize: {
    fn: jest.fn(() => "COUNT"),
    col: jest.fn(() => "questions.id"),
    transaction: jest.fn(),
  },
}));

const app = require("./app");
const authMiddleware = require("./middleware/auth");

const adminToken = () => authMiddleware.generateToken(users.admin.id);
const studentToken = () => authMiddleware.generateToken(users.student.id);

const setAuthenticatedUser = (user) => {
  mockModelMethods.User.findByPk.mockImplementation(async (id) => {
    if (Number(id) === user.id) return user;
    return null;
  });
};

beforeEach(() => {
  Object.values(mockModelMethods).forEach((model) => {
    Object.values(model).forEach((method) => method.mockReset());
  });

  mockModelMethods.User.findByPk.mockResolvedValue(null);
  mockModelMethods.QuestionSet.findAll.mockResolvedValue([]);
  mockModelMethods.Attempt.findAll.mockResolvedValue([]);
  mockModelMethods.AttemptAnswer.findAll.mockResolvedValue([]);
});

describe("health and API documentation", () => {
  it("returns the API status", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Quiz App API is running!",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        admin: "/api/admin",
        student: "/api/student",
      },
    });
  });

  it("serves Swagger UI", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("swagger-ui");
  });
});

describe("authentication", () => {
  it("rejects an invalid registration payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      success: false,
      message: "Validation failed",
    });
    expect(mockModelMethods.User.findByEmail).not.toHaveBeenCalled();
  });

  it("registers a student and returns a JWT", async () => {
    mockModelMethods.User.findByEmail.mockResolvedValue(null);
    mockModelMethods.User.create.mockImplementation(async (attributes) => ({
      id: 3,
      ...attributes,
      toJSON: () => ({ id: 3, ...attributes }),
    }));

    const response = await request(app).post("/api/auth/register").send({
      email: "new@example.com",
      password: "Password123",
      firstName: "New",
      lastName: "Student",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "User registered successfully",
      user: {
        id: 3,
        email: "new@example.com",
        role: "student",
      },
    });
    expect(typeof response.body.token).toBe("string");
    expect(mockModelMethods.User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        firstName: "New",
        lastName: "Student",
        role: "student",
      }),
    );
    expect(
      await bcrypt.compare(
        "Password123",
        mockModelMethods.User.create.mock.calls[0][0].password,
      ),
    ).toBe(true);
  });

  it("rejects registration when the email is already in use", async () => {
    mockModelMethods.User.findByEmail.mockResolvedValue(users.student);

    const response = await request(app).post("/api/auth/register").send({
      email: users.student.email,
      password: "Password123",
      firstName: "Existing",
      lastName: "User",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Email already in use" });
    expect(mockModelMethods.User.create).not.toHaveBeenCalled();
  });

  it("rejects invalid login input before querying the database", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "bad-email",
    });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({
      success: false,
      message: "Validation failed",
    });
    expect(mockModelMethods.User.findByEmail).not.toHaveBeenCalled();
  });

  it("returns a 400 response for an unknown login email", async () => {
    mockModelMethods.User.findByEmail.mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send({
      email: "unknown@example.com",
      password: "Password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("returns a 400 response for an incorrect password", async () => {
    mockModelMethods.User.findByEmail.mockResolvedValue({
      ...users.student,
      password: await bcrypt.hash("CorrectPassword123", 10),
    });

    const response = await request(app).post("/api/auth/login").send({
      email: users.student.email,
      password: "WrongPassword123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("logs in a user and returns a JWT", async () => {
    mockModelMethods.User.findByEmail.mockResolvedValue({
      ...users.student,
      password: await bcrypt.hash(users.student.password, 10),
    });

    const response = await request(app).post("/api/auth/login").send({
      email: users.student.email,
      password: users.student.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: "Login successful",
      user: { id: users.student.id, email: users.student.email },
    });
    expect(typeof response.body.token).toBe("string");
  });
});

describe("authorization and role restrictions", () => {
  const adminRoutes = [
    ["get", "/api/admin/question-sets"],
    ["post", "/api/admin/question-sets"],
    ["get", "/api/admin/users"],
    ["get", "/api/admin/attempts"],
  ];

  const studentRoutes = [
    ["get", "/api/student/dashboard"],
    ["get", "/api/student/question-sets"],
    ["get", "/api/student/question-sets/1"],
    ["post", "/api/student/attempt/1/submit"],
  ];

  it.each([...adminRoutes, ...studentRoutes])(
    "rejects unauthenticated %s %s requests",
    async (method, path) => {
      const response = await request(app)[method](path);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });
    },
  );

  it("rejects an invalid bearer token", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid or expired token");
  });

  it("prevents students from accessing admin routes", async () => {
    setAuthenticatedUser(users.student);

    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${studentToken()}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden. Admins only.");
  });

  it("prevents admins from accessing student routes", async () => {
    setAuthenticatedUser(users.admin);

    const response = await request(app)
      .get("/api/student/dashboard")
      .set("Authorization", `Bearer ${adminToken()}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden. Students only.");
  });

  it("rejects a valid token when its user no longer exists", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken()}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token. User not found.");
  });
});

describe("admin API", () => {
  beforeEach(() => setAuthenticatedUser(users.admin));

  it("returns question sets for an authenticated admin", async () => {
    mockModelMethods.QuestionSet.findAll.mockResolvedValue([
      { id: 1, title: "JavaScript Basics" },
    ]);

    const response = await request(app)
      .get("/api/admin/question-sets")
      .set("Authorization", `Bearer ${adminToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      questionSets: [{ id: 1, title: "JavaScript Basics" }],
    });
  });

  it("validates question set creation", async () => {
    const response = await request(app)
      .post("/api/admin/question-sets")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ youtubeLink: "not-a-url" });

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Validation failed");
    expect(mockModelMethods.QuestionSet.create).not.toHaveBeenCalled();
  });

  it("creates a question set for an authenticated admin", async () => {
    mockModelMethods.QuestionSet.max.mockResolvedValue(2);
    mockModelMethods.QuestionSet.create.mockResolvedValue({
      id: 3,
      title: "Node.js",
      sortOrder: 3,
    });

    const response = await request(app)
      .post("/api/admin/question-sets")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send({ title: "Node.js", status: "active" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: "Question set created successfully",
      questionSet: { id: 3, sortOrder: 3 },
    });
  });

  it("returns a 500 response when an admin query fails", async () => {
    mockModelMethods.QuestionSet.findAll.mockRejectedValue(new Error("db down"));

    const response = await request(app)
      .get("/api/admin/question-sets")
      .set("Authorization", `Bearer ${adminToken()}`);

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({
      success: false,
      message: "Server error",
      error: "db down",
    });
  });
});

describe("student API", () => {
  beforeEach(() => setAuthenticatedUser(users.student));

  it("returns an empty student dashboard", async () => {
    const response = await request(app)
      .get("/api/student/dashboard")
      .set("Authorization", `Bearer ${studentToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        stats: expect.objectContaining({
          completedQuizzes: 0,
          totalQuizzes: 0,
        }),
        questionSets: [],
      },
    });
  });

  it("validates submitted answers", async () => {
    const response = await request(app)
      .post("/api/student/attempt/1/submit")
      .set("Authorization", `Bearer ${studentToken()}`)
      .send({ answers: [{ questionId: "one", selectedOptionId: 2 }] });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: "Validation failed",
    });
    expect(mockModelMethods.Attempt.findOne).not.toHaveBeenCalled();
  });

  it("returns a 404 when a question set does not exist", async () => {
    mockModelMethods.QuestionSet.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/student/question-sets/999")
      .set("Authorization", `Bearer ${studentToken()}`);

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: "Question set not found",
    });
  });

  it("returns a 404 when an attempt does not belong to the student", async () => {
    mockModelMethods.Attempt.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/student/attempt/999/result")
      .set("Authorization", `Bearer ${studentToken()}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Attempt not found");
  });
});
