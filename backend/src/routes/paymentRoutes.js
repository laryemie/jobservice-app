const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all payment routes with authentication
router.use(authMiddleware);

// Create a payment (client only)
router.post('/create', roleMiddleware(['client']), paymentController.createPayment);

// Get payments for the authenticated user (client or worker)
router.get('/', paymentController.getPayments);

// Mark a service request as completed (worker only, for testing payments)
router.post('/complete/:requestId', roleMiddleware(['worker']), paymentController.completeServiceRequest);

module.exports = router;