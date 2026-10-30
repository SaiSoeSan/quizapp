process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "1h";

jest.mock("../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

const jwt = require("jsonwebtoken");
const { User } = require("../models");
const {
  generateToken,
  authenticate,
  adminOnly,
  studentOnly,
} = require("./auth");

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("generateToken", () => {
  it("generates a token containing the user id", () => {
    const token = generateToken(123);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.userId).toBe(123);
  });
});

describe("authenticate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects requests without a bearer token", async () => {
    const req = { headers: {} };
    const res = createResponse();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid tokens", async () => {
    const req = { headers: { authorization: "Bearer invalid-token" } };
    const res = createResponse();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a valid token when the user does not exist", async () => {
    User.findByPk.mockResolvedValue(null);
    const token = generateToken(123);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createResponse();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(User.findByPk).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token. User not found.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the user and calls next for a valid token", async () => {
    const user = { id: 123, role: "student" };
    User.findByPk.mockResolvedValue(user);
    const token = generateToken(user.id);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createResponse();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe("adminOnly", () => {
  it("allows admins", () => {
    const next = jest.fn();

    adminOnly({ user: { role: "admin" } }, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects non-admin users", () => {
    const res = createResponse();

    adminOnly({ user: { role: "student" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden. Admins only.",
    });
  });
});

describe("studentOnly", () => {
  it("allows students", () => {
    const next = jest.fn();

    studentOnly({ user: { role: "student" } }, createResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects non-students", () => {
    const res = createResponse();

    studentOnly({ user: { role: "admin" } }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden. Students only.",
    });
  });
});
