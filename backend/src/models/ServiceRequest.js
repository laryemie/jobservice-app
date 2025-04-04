const pool = require('../config/database');

const ServiceRequest = {
  // Create a new service request
  create: async (clientId, description) => {
    const [result] = await pool.query(
      'INSERT INTO service_requests (client_id, description) VALUES (?, ?)',
      [clientId, description]
    );
    return result.insertId;
  },

  // Find service requests by client ID
  findByClientId: async (clientId) => {
    const [rows] = await pool.query(
      'SELECT sr.*, w.skills, u.email AS worker_email FROM service_requests sr ' +
      'LEFT JOIN workers w ON sr.worker_id = w.id ' +
      'LEFT JOIN users u ON w.user_id = u.id ' +
      'WHERE sr.client_id = ?',
      [clientId]
    );
    return rows;
  },

  // Find service requests by worker ID
  findByWorkerId: async (workerId) => {
    const [rows] = await pool.query(
      'SELECT sr.*, c.user_id AS client_user_id, u.email AS client_email FROM service_requests sr ' +
      'LEFT JOIN clients c ON sr.client_id = c.id ' +
      'LEFT JOIN users u ON c.user_id = u.id ' +
      'WHERE sr.worker_id = ?',
      [workerId]
    );
    return rows;
  },

  // Find available service requests (not yet accepted)
  findAvailable: async () => {
    const [rows] = await pool.query(
      'SELECT sr.*, c.user_id AS client_user_id, u.email AS client_email FROM service_requests sr ' +
      'LEFT JOIN clients c ON sr.client_id = c.id ' +
      'LEFT JOIN users u ON c.user_id = u.id ' +
      'WHERE sr.status = "pending" AND sr.worker_id IS NULL'
    );
    return rows;
  },

  // Update a service request (e.g., assign a worker, update status)
  update: async (requestId, updates) => {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(requestId);
    const [result] = await pool.query(
      `UPDATE service_requests SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  // Find a service request by ID
  findById: async (requestId) => {
    const [rows] = await pool.query('SELECT * FROM service_requests WHERE id = ?', [requestId]);
    return rows[0];
  },
};

module.exports = ServiceRequest;