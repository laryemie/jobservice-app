const authService = require('../services/authService');

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { email, password, role, skills } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
      }

      if (role !== 'client' && role !== 'worker') {
        return res.status(400).json({ message: 'Role must be either "client" or "worker"' });
      }

      if (role === 'worker' && !skills) {
        return res.status(400).json({ message: 'Skills are required for workers' });
      }

      const result = await authService.register(email, password, role, skills);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Login a user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },
};

module.exports = authController;