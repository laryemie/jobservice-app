const pool = require('../config/database');

const Payment = {
  // Create a new payment
  create: async (serviceRequestId, clientId, workerId, amount) => {
    const [result] = await pool.query(
      'INSERT INTO payments (service_request_id, client_id, worker_id, amount) VALUES (?, ?, ?, ?)',
      [serviceRequestId, clientId, workerId, amount]
    );
    return result.insertId;
  },

  // Update payment status
  updateStatus: async (paymentId, status) => {
    const [result] = await pool.query(
      'UPDATE payments SET status = ? WHERE id = ?',
      [status, paymentId]
    );
    return result.affectedRows;
  },

  // Find payments by client ID
  findByClientId: async (clientId) => {
    const [rows] = await pool.query(
      'SELECT p.*, sr.description FROM payments p ' +
      'JOIN service_requests sr ON p.service_request_id = sr.id ' +
      'WHERE p.client_id = ?',
      [clientId]
    );
    return rows;
  },

  // Find payments by worker ID
  findByWorkerId: async (workerId) => {
    const [rows] = await pool.query(
      'SELECT p.*, sr.description FROM payments p ' +
      'JOIN service_requests sr ON p.service_request_id = sr.id ' +
      'WHERE p.worker_id = ?',
      [workerId]
    );
    return rows;
  },
};

module.exports = Payment;