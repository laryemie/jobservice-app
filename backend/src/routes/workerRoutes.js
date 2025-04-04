const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all worker routes with authentication and role check
router.use(authMiddleware);
router.use(roleMiddleware(['worker']));

// Update worker profile
router.put('/profile', workerController.updateProfile);

// Get available service requests
router.get('/requests/available', workerController.getAvailableRequests);

// Accept a service request
router.post('/requests/:requestId/accept', workerController.acceptRequest);

// Mark a service request as completed
router.post('/requests/:requestId/complete', workerController.completeRequest);

module.exports = router;