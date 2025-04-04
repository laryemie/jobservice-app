const workerService = require('../services/workerService');
const Worker = require('../models/Worker');

const workerController = {
  // Update worker profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id; // From authMiddleware
      const { skills, experience } = req.body;

      const result = await workerService.updateProfile(userId, { skills, experience });
      res.status(200).json({ message: 'Profile updated successfully', affectedRows: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get available service requests
  getAvailableRequests: async (req, res) => {
    try {
      const requests = await workerService.getAvailableRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Accept a service request
  acceptRequest: async (req, res) => {
    try {
      const workerId = req.user.id; // From authMiddleware
      const { requestId } = req.params;

      const request = await workerService.acceptRequest(workerId, requestId);
      res.status(200).json({ message: 'Service request accepted', request });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mark a service request as completed
  completeRequest: async (req, res) => {
    try {
      const workerId = req.user.id; // From authMiddleware
      const { requestId } = req.params;

      const request = await workerService.completeRequest(workerId, requestId);
      res.status(200).json({ message: 'Service request marked as completed', request });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = workerController;