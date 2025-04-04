const clientService = require('../services/clientService');

const clientController = {
  // Request a service
  requestService: async (req, res) => {
    try {
      const clientUserId = req.user.id; // From authMiddleware
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ message: 'Description is required' });
      }

      const requestId = await clientService.requestService(clientUserId, description);
      res.status(201).json({ message: 'Service request created', requestId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get available workers
  getAvailableWorkers: async (req, res) => {
    try {
      const workers = await clientService.getAvailableWorkers();
      res.status(200).json(workers);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = clientController;