const pool = require('../config/database');

const Client = {
  // Create a new client
  create: async (userId) => {
    const [result] = await pool.query(
      'INSERT INTO clients (user_id) VALUES (?)',
      [userId]
    );
    return result.insertId;
  },

  // Find a client by user ID
  findByUserId: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM clients WHERE user_id = ?', [userId]);
    return rows[0];
  },
};

module.exports = Client;