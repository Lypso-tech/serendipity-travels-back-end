const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

// Function to generate a JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register a new user
exports.registerUser = async (req, res) => {
  const { full_name, username, email, password, profile_image, role } =
    req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({
      full_name,
      username,
      email,
      password,
      profile_image,
      role,
    });

    // Return success response with user data and token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    // Error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and if the password is correct
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      // Invalid credentials
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // Error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all users
exports.getUsers = async (req, res) => {
  try {
    // Get all users from the database
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    // Error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    // Error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // If password is provided, update it
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (error) {
    // Error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from the database
    await user.remove();

    res.json({ message: "User removed successfully" });
  } catch (error) {
    // Error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
