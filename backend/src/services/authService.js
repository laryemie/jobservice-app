const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Client = require('../models/Client');
const { generateToken } = require('../utils/jwt');

const authService = {
  // Register a new user (client or worker)
  register: async (email, password, role, skills = null) => {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const userId = await User.create(email, hashedPassword, role);

    // Create a worker or client record based on role
    let profile;
    if (role === 'worker') {
      profile = await Worker.create(userId, skills);
    } else if (role === 'client') {
      profile = await Client.create(userId);
    }

    // Generate JWT token
    const user = { id: userId, role };
    const token = generateToken(user);

    return { token, user: { id: userId, email, role } };
  },

  // Login a user
  login: async (email, password) => {
    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken(user);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  },
};

module.exports = authService;