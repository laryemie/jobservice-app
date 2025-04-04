const pool = require('../config/database');

const FraudReport = {
  // Create a new fraud report
  create: async (reporterId, reportedUserId, description) => {
    const [result] = await pool.query(
      'INSERT INTO fraud_reports (reporter_id, reported_user_id, description) VALUES (?, ?, ?)',
      [reporterId, reportedUserId, description]
    );
    return result.insertId;
  },

  // Find fraud reports by status
  findByStatus: async (status) => {
    const [rows] = await pool.query(
      'SELECT fr.*, u1.email AS reporter_email, u2.email AS reported_email FROM fraud_reports fr ' +
      'JOIN users u1 ON fr.reporter_id = u1.id ' +
      'JOIN users u2 ON fr.reported_user_id = u2.id ' +
      'WHERE fr.status = ?',
      [status]
    );
    return rows;
  },

  // Update fraud report status
  updateStatus: async (reportId, status) => {
    const [result] = await pool.query(
      'UPDATE fraud_reports SET status = ? WHERE id = ?',
      [status, reportId]
    );
    return result.affectedRows;
  },
};

module.exports = FraudReport;