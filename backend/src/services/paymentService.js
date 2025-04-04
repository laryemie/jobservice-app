const Payment = require('../models/Payment');
const ServiceRequest = require('../models/ServiceRequest');
const Client = require('../models/Client');
const Worker = require('../models/Worker');

const paymentService = {
  // Create a payment for a completed service request
  createPayment: async (clientUserId, serviceRequestId, amount) => {
    // Verify the service request exists and is completed
    const request = await ServiceRequest.findById(serviceRequestId);
    if (!request) {
      throw new Error('Service request not found');
    }
    if (request.status !== 'completed') {
      throw new Error('Service request must be completed to create a payment');
    }

    // Verify the client
    const client = await Client.findByUserId(clientUserId);
    if (!client || request.client_id !== client.id) {
      throw new Error('Access denied: Not your service request');
    }

    // Verify the worker
    if (!request.worker_id) {
      throw new Error('No worker assigned to this service request');
    }

    // Create the payment
    const paymentId = await Payment.create(serviceRequestId, client.id, request.worker_id, amount);
    return paymentId;
  },

  // Get payments for a user (client or worker)
  getPayments: async (userId, role) => {
    if (role === 'client') {
      const client = await Client.findByUserId(userId);
      if (!client) {
        throw new Error('Client not found');
      }
      return await Payment.findByClientId(client.id);
    } else if (role === 'worker') {
      const worker = await Worker.findByUserId(userId);
      if (!worker) {
        throw new Error('Worker not found');
      }
      return await Payment.findByWorkerId(worker.id);
    } else {
      throw new Error('Invalid role');
    }
  },
};

module.exports = paymentService;