const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all client routes with authentication and role check
router.use(authMiddleware);
router.use(roleMiddleware(['client']));

// Request a service
router.post('/request-service', clientController.requestService);

// Get available workers
router.get('/workers', clientController.getAvailableWorkers);

module.exports = router;