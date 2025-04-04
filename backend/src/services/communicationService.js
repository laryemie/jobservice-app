const Message = require('../models/Message');
const ServiceRequest = require('../models/ServiceRequest');
const Client = require('../models/Client');
const Worker = require('../models/Worker');

const communicationService = {
  // Send a message
  sendMessage: async (senderId, serviceRequestId, message) => {
    // Verify the service request exists
    const request = await ServiceRequest.findById(serviceRequestId);
    if (!request) {
      throw new Error('Service request not found');
    }

    // Determine the receiver based on the sender's role
    const sender = await pool.query('SELECT role FROM users WHERE id = ?', [senderId]);
    if (!sender[0][0]) {
      throw new Error('Sender not found');
    }

    let receiverId;
    if (sender[0][0].role === 'client') {
      // Sender is a client, receiver is the worker
      if (!request.worker_id) {
        throw new Error('No worker assigned to this service request');
      }
      const worker = await Worker.findByUserId(request.worker_id);
      if (!worker) {
        throw new Error('Worker not found');
      }
      receiverId = worker.user_id;
    } else if (sender[0][0].role === 'worker') {
      // Sender is a worker, receiver is the client
      const client = await Client.findByUserId(request.client_id);
      if (!client) {
        throw new Error('Client not found');
      }
      receiverId = client.user_id;
    } else {
      throw new Error('Invalid sender role');
    }

    // Create the message
    const messageId = await Message.create(senderId, receiverId, serviceRequestId, message);
    return messageId;
  },

  // Get messages for a service request
  getMessages: async (userId, serviceRequestId) => {
    // Verify the user is part of the service request
    const request = await ServiceRequest.findById(serviceRequestId);
    if (!request) {
      throw new Error('Service request not found');
    }

    const client = await Client.findByUserId(request.client_id);
    const worker = request.worker_id ? await Worker.findByUserId(request.worker_id) : null;

    if (
      (client && client.user_id !== userId) &&
      (worker && worker.user_id !== userId)
    ) {
      throw new Error('Unauthorized: You are not part of this service request');
    }

    // Retrieve messages
    return await Message.findByServiceRequestId(serviceRequestId);
  },
};

module.exports = communicationService;