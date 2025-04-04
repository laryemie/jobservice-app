const Client = require('../models/Client');
const ServiceRequest = require('../models/ServiceRequest');
const Worker = require('../models/Worker');
const pool = require('../config/database');

const clientService = {
  // Request a service
  requestService: async (clientUserId, description) => {
    const client = await Client.findByUserId(clientUserId);
    if (!client) {
      throw new Error('Client not found');
    }

    const requestId = await ServiceRequest.create(client.id, description);
    return requestId;
  },

  // Get available workers
  getAvailableWorkers: async () => {
    const [rows] = await pool.query(
      'SELECT w.*, u.email FROM workers w JOIN users u ON w.user_id = u.id'
    );
    return rows;
  },
};

module.exports = clientService;