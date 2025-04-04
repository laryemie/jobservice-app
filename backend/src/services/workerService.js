const Worker = require('../models/Worker');
const ServiceRequest = require('../models/ServiceRequest');
const pool = require('../config/database');

const workerService = {
  // Update worker profile
  updateProfile: async (userId, updates) => {
    const worker = await Worker.findByUserId(userId);
    if (!worker) {
      throw new Error('Worker not found');
    }

    const fields = {};
    if (updates.skills) fields.skills = updates.skills;
    if (updates.experience) fields.experience = updates.experience;

    if (Object.keys(fields).length === 0) {
      throw new Error('No valid fields to update');
    }

    const [result] = await pool.query(
      'UPDATE workers SET ? WHERE user_id = ?',
      [fields, userId]
    );
    return result.affectedRows;
  },

  // Get available service requests
  getAvailableRequests: async () => {
    return await ServiceRequest.findAvailable();
  },

  // Accept a service request
  acceptRequest: async (workerId, requestId) => {
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      throw new Error('Service request not found');
    }
    if (request.status !== 'pending' || request.worker_id) {
      throw new Error('Service request is not available');
    }

    await ServiceRequest.update(requestId, { worker_id: workerId, status: 'accepted' });
    return request;
  },

  // Mark a service request as completed
  completeRequest: async (workerId, requestId) => {
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      throw new Error('Service request not found');
    }
    if (request.worker_id !== workerId) {
      throw new Error('Unauthorized: You are not assigned to this service request');
    }
    if (request.status !== 'accepted') {
      throw new Error('Service request must be in "accepted" status to mark as completed');
    }

    await ServiceRequest.update(requestId, { status: 'completed' });
    return request;
  },
};

module.exports = workerService;