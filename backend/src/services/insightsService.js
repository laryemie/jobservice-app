const pool = require('../config/database');

const insightsService = {
  getInsights: async () => {
    const [usersByRole] = await pool.query(
      'SELECT role, COUNT(*) AS count FROM users GROUP BY role'
    );
    const [totalPayments] = await pool.query(
      'SELECT SUM(amount) AS total FROM payments WHERE status = "completed"'
    );
    const [requestStatuses] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM service_requests GROUP BY status'
    );

    return {
      usersByRole,
      totalPayments: totalPayments[0].total || 0,
      requestStatuses,
    };
  },
};

module.exports = insightsService;