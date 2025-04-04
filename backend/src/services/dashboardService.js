const pool = require('../config/database');

const dashboardService = {
  // Get recent service requests for a client
  getClientDashboard: async (clientUserId) => {
    const [client] = await pool.query('SELECT id FROM clients WHERE user_id = ?', [clientUserId]);
    const clientId = client[0]?.id;
    if (!clientId) throw new Error('Client not found');

    const [requests] = await pool.query(
      'SELECT sr.*, w.skills, u.email AS worker_email FROM service_requests sr ' +
      'LEFT JOIN workers w ON sr.worker_id = w.id ' +
      'LEFT JOIN users u ON w.user_id = u.id ' +
      'WHERE sr.client_id = ? ORDER BY sr.created_at DESC LIMIT 5',
      [clientId]
    );
    return requests;
  },

  // Get accepted service requests for a worker
  getWorkerDashboard: async (workerUserId) => {
    const [worker] = await pool.query('SELECT id FROM workers WHERE user_id = ?', [workerUserId]);
    const workerId = worker[0]?.id;
    if (!workerId) throw new Error('Worker not found');

    const [requests] = await pool.query(
      'SELECT sr.*, c.user_id AS client_user_id, u.email AS client_email FROM service_requests sr ' +
      'LEFT JOIN clients c ON sr.client_id = c.id ' +
      'LEFT JOIN users u ON c.user_id = u.id ' +
      'WHERE sr.worker_id = ? AND sr.status = "accepted" ORDER BY sr.created_at DESC LIMIT 5',
      [workerId]
    );
    return requests;
  },

  // Get admin dashboard data
  getAdminDashboard: async () => {
    const [users] = await pool.query('SELECT COUNT(*) AS count FROM users');
    const [requests] = await pool.query('SELECT COUNT(*) AS count FROM service_requests');
    const [payments] = await pool.query('SELECT COUNT(*) AS count FROM payments WHERE status = "completed"');
    const [fraudReports] = await pool.query('SELECT COUNT(*) AS count FROM fraud_reports WHERE status = "pending"');

    return {
      totalUsers: users[0].count,
      totalRequests: requests[0].count,
      totalPayments: payments[0].count,
      pendingFraudReports: fraudReports[0].count,
    };
  },
};

module.exports = dashboardService;