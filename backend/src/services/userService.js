const pool = require('../config/database');

const userService = {
  // Get all users
  getAllUsers: async () => {
    const [rows] = await pool.query('SELECT id, email, role, created_at FROM users');
    return rows;
  },
};

module.exports = userService;