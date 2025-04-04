const FraudReport = require('../models/FraudReport');

const fraudService = {
  // Create a fraud report
  createFraudReport: async (reporterId, reportedUserId, description) => {
    return await FraudReport.create(reporterId, reportedUserId, description);
  },

  // Get fraud reports by status
  getFraudReports: async (status) => {
    return await FraudReport.findByStatus(status);
  },

  // Update fraud report status
  updateFraudReportStatus: async (reportId, status) => {
    if (!['pending', 'resolved', 'dismissed'].includes(status)) {
      throw new Error('Invalid status');
    }
    return await FraudReport.updateStatus(reportId, status);
  },
};

module.exports = fraudService;