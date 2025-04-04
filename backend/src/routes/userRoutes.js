const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fraudController = require('../controllers/fraudController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect all user routes with authentication
router.use(authMiddleware);

// Create a fraud report (any authenticated user)
router.post('/fraud-report', fraudController.createFraudReport);

// Admin-only routes
router.use(roleMiddleware(['admin']));

// Get all users
router.get('/', userController.getAllUsers);

// Get fraud reports
router.get('/fraud-reports', fraudController.getFraudReports);

// Update fraud report status
router.put('/fraud-reports/:reportId', fraudController.updateFraudReportStatus);

module.exports = router;