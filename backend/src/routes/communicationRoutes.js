const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all communication routes with authentication
router.use(authMiddleware);
router.use(roleMiddleware(['client', 'worker']));

// Send a message
router.post('/send', communicationController.sendMessage);

// Get messages for a service request
router.get('/messages/:serviceRequestId', communicationController.getMessages);

module.exports = router;