const dashboardService = require('../services/dashboardService');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      const userId = req.user.id;
      const role = req.user.role;

      let data;
      if (role === 'client') {
        data = await dashboardService.getClientDashboard(userId);
      } else if (role === 'worker') {
        data = await dashboardService.getWorkerDashboard(userId);
      } else if (role === 'admin') {
        data = await dashboardService.getAdminDashboard();
      } else {
        throw new Error('Invalid role');
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = dashboardController;