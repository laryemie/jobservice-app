const insightsService = require('../services/insightsService');

const insightsController = {
  getInsights: async (req, res) => {
    try {
      const insights = await insightsService.getInsights();
      res.status(200).json(insights);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = insightsController;