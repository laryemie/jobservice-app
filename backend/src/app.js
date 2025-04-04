const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const insightsRoutes = require('./routes/insightsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;