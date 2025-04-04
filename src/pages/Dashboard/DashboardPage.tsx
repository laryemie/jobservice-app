import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Card, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../components/Context/AuthContext';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import './Dashboard.scss';

interface ServiceRequest {
  id: number;
  client_id: number;
  worker_id: number | null;
  description: string;
  status: string;
  created_at: string;
  client_email?: string;
  worker_email?: string;
}

interface AdminDashboard {
  totalUsers: number;
  totalRequests: number;
  totalPayments: number;
  pendingFraudReports: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', user?.role],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
    enabled: !!user,
  });

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load dashboard data');
    return <Alert variant="danger">Failed to load dashboard data</Alert>;
  }

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      {user?.role === 'client' && (
        <>
          <h3>Recent Service Requests</h3>
          {data && data.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Worker</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {(data as ServiceRequest[]).map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.description}</td>
                    <td>{request.status}</td>
                    <td>{request.worker_email || 'Not assigned'}</td>
                    <td>{new Date(request.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoData />
          )}
        </>
      )}

      {user?.role === 'worker' && (
        <>
          <h3>Accepted Service Requests</h3>
          {data && data.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Client</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {(data as ServiceRequest[]).map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.description}</td>
                    <td>{request.client_email}</td>
                    <td>{new Date(request.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoData />
          )}
        </>
      )}

      {user?.role === 'admin' && (
        <>
          <h3>Admin Overview</h3>
          <div className="dashboard-cards">
            <Card>
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text>{(data as AdminDashboard)?.totalUsers}</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Total Service Requests</Card.Title>
                <Card.Text>{(data as AdminDashboard)?.totalRequests}</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Completed Payments</Card.Title>
                <Card.Text>{(data as AdminDashboard)?.totalPayments}</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Pending Fraud Reports</Card.Title>
                <Card.Text>{(data as AdminDashboard)?.pendingFraudReports}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;