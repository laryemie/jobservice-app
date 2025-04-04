const paymentService = require('../services/paymentService');
const ServiceRequest = require('../models/ServiceRequest');

const paymentController = {
  // Create a payment
  createPayment: async (req, res) => {
    try {
      const clientUserId = req.user.id; // From authMiddleware
      const { serviceRequestId, amount } = req.body;

      if (!serviceRequestId || !amount) {
        return res.status(400).json({ message: 'Service request ID and amount are required' });
      }

      if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }

      const paymentId = await paymentService.createPayment(clientUserId, serviceRequestId, amount);
      res.status(201).json({ message: 'Payment created successfully', paymentId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get payments for the authenticated user
  getPayments: async (req, res) => {
    try {
      const userId = req.user.id; // From authMiddleware
      const role = req.user.role; // From authMiddleware

      const payments = await paymentService.getPayments(userId, role);
      res.status(200).json(payments);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mark a service request as completed (for testing payments)
  completeServiceRequest: async (req, res) => {
    try {
      const userId = req.user.id; // From authMiddleware
      const role = req.user.role; // From authMiddleware
      const { requestId } = req.params;

      const request = await ServiceRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Service request not found' });
      }

      if (role === 'worker') {
        const worker = await Worker.findByUserId(userId);
        if (request.worker_id !== worker.id) {
          return res.status(403).json({ message: 'Access denied: Not your service request' });
        }
      } else {
        return res.status(403).json({ message: 'Only workers can complete service requests' });
      }

      await ServiceRequest.update(requestId, { status: 'completed' });
      res.status(200).json({ message: 'Service request marked as completed' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = paymentController;