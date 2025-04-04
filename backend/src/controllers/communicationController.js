const communicationService = require('../services/communicationService');

const communicationController = {
  // Send a message
  sendMessage: async (req, res) => {
    try {
      const senderId = req.user.id; // From authMiddleware
      const { serviceRequestId, message } = req.body;

      if (!serviceRequestId || !message) {
        return res.status(400).json({ message: 'Service request ID and message are required' });
      }

      const messageId = await communicationService.sendMessage(senderId, serviceRequestId, message);
      res.status(201).json({ message: 'Message sent successfully', messageId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get messages for a service request
  getMessages: async (req, res) => {
    try {
      const userId = req.user.id; // From authMiddleware
      const { serviceRequestId } = req.params;

      if (!serviceRequestId) {
        return res.status(400).json({ message: 'Service request ID is required' });
      }

      const messages = await communicationService.getMessages(userId, serviceRequestId);
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = communicationController;