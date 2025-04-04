import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './components/Context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import CommunicationPage from './pages/Communication/CommunicationPage';
import PaymentsPage from './pages/Payments/PaymentsPage';
import AdminManageUsersPage from './pages/AdminManageUsers/AdminManageUsersPage';
import AdminManageJobsPage from './pages/AdminManageJobs/AdminManageJobsPage';
import RequestServicePage from './pages/RequestService/RequestServicePage';
import ViewWorkersPage from './pages/ViewWorkers/ViewWorkersPage';
import WorkerProfilePage from './pages/WorkerProfile/WorkerProfilePage';
import WorkerRequestsPage from './pages/WorkerRequests/WorkerRequestsPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminInsightsPage from './pages/AdminInsights/AdminInsightsPage';
import FraudReportPage from './pages/FraudReport/FraudReportPage';
import { NavigateWrapper } from './services/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    NavigateWrapper.setNavigate(navigate);
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <NavigateWrapper />
          <Routes>
            <Route
              path="/login"
              element={
                <Layout>
                  <LoginPage />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <RegisterPage />
                </Layout>
              }
            />
            <Route
              path="/communication/:serviceRequestId"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['client', 'worker', 'admin']}>
                    <CommunicationPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/payments"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['client', 'worker']}>
                    <PaymentsPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminManageUsersPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminManageJobsPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/insights"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminInsightsPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/request-service"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['client']}>
                    <RequestServicePage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/view-workers"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['client']}>
                    <ViewWorkersPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/worker-profile"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['worker']}>
                    <WorkerProfilePage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/worker-requests"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['worker']}>
                    <WorkerRequestsPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['client', 'worker', 'admin']}>
                    <DashboardPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/fraud-report"
              element={
                <Layout>
                  <ProtectedRoute allowedRoles={['client', 'worker']}>
                    <FraudReportPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <div>Welcome to JobService</div>
                </Layout>
              }
            />
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;