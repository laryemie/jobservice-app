const fraudService = require('../services/fraudService');

const fraudController = {
  // Create a fraud report
  createFraudReport: async (req, res) => {
    try {
      const reporterId = req.user.id; // From authMiddleware
      const { reportedUserId, description } = req.body;

      if (!reportedUserId || !description) {
        return res.status(400).json({ message: 'Reported user ID and description are required' });
      }

      const reportId = await fraudService.createFraudReport(reporterId, reportedUserId, description);
      res.status(201).json({ message: 'Fraud report created successfully', reportId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get fraud reports (admin only)
  getFraudReports: async (req, res) => {
    try {
      const { status = 'pending' } = req.query;
      const reports = await fraudService.getFraudReports(status);
      res.status(200).json(reports);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update fraud report status (admin only)
  updateFraudReportStatus: async (req, res) => {
    try {
      const { reportId } = req.params;
      const { status } = req.body;

      const result = await fraudService.updateFraudReportStatus(reportId, status);
      res.status(200).json({ message: 'Fraud report status updated', affectedRows: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = fraudController;