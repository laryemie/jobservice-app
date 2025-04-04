const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/request', async (req, res) => {
  const { client_id, description, time_of_execution } = req.body;

  try {
    await pool.query(
      'INSERT INTO Request (client_id, description, time_of_execution, state) VALUES (?, ?, ?, ?)',
      [client_id, description, time_of_execution, 0]
    );

    // Logic to notify workers (e.g., send email or push notification)
    res.status(201).json({ message: 'Service request created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;