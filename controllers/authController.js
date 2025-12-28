const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const authMiddleware = require("../middleware/auth");

const { User } = require("../models");

/**
 * Register a new user
 */

const register = async (req, res) => {
  // Check validation results FIRST
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { email, phone, password, firstName, lastName, role } = req.body;

    // Check if user with the same email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: role || "student",
    });

    const token = authMiddleware.generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token: token,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * Login an existing user
 */

const login = async (req, res) => {
  // Check validation results FIRST
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = authMiddleware.generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
