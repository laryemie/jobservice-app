const pool = require('../config/database');

const Message = {
  // Create a new message
  create: async (senderId, receiverId, serviceRequestId, message) => {
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, service_request_id, message) VALUES (?, ?, ?, ?)',
      [senderId, receiverId, serviceRequestId, message]
    );
    return result.insertId;
  },

  // Find messages by service request ID
  findByServiceRequestId: async (serviceRequestId) => {
    const [rows] = await pool.query(
      'SELECT m.*, u1.email AS sender_email, u2.email AS receiver_email FROM messages m ' +
      'JOIN users u1 ON m.sender_id = u1.id ' +
      'JOIN users u2 ON m.receiver_id = u2.id ' +
      'WHERE m.service_request_id = ? ORDER BY m.created_at ASC',
      [serviceRequestId]
    );
    return rows;
  },
};

module.exports = Message;