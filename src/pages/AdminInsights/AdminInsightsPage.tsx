import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Table, Alert, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import SimpleChart from '../../components/SimpleChart/SimpleChart';
import { toast } from 'react-toastify';
import '../Dashboard/Dashboard.scss';

interface Insights {
  usersByRole: { role: string; count: number }[];
  totalPayments: number;
  requestStatuses: { status: string; count: number }[];
}

const AdminInsightsPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const response = await api.get('/insights');
      return response.data as Insights;
    },
  });

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load insights');
    return <Alert variant="danger">Failed to load insights</Alert>;
  }

  const insights = data as Insights;

  const usersByRoleChartData = {
    labels: insights?.usersByRole.map((roleData) => roleData.role) || [],
    datasets: [
      {
        label: 'Users by Role',
        data: insights?.usersByRole.map((roleData) => roleData.count) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  const requestStatusesChartData = {
    labels: insights?.requestStatuses.map((statusData) => statusData.status) || [],
    datasets: [
      {
        label: 'Service Requests by Status',
        data: insights?.requestStatuses.map((statusData) => statusData.count) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-page">
      <h2>Admin Insights</h2>
      <div className="dashboard-cards">
        <Card>
          <Card.Body>
            <Card.Title>Total Payments</Card.Title>
            <Card.Text>${insights?.totalPayments.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <Row className="mt-4">
        <Col md={6}>
          <h3>Users by Role</h3>
          {insights?.usersByRole && insights.usersByRole.length > 0 ? (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <SimpleChart type="pie" data={usersByRoleChartData} />
            </div>
          ) : (
            <NoData />
          )}
        </Col>
        <Col md={6}>
          <h3>Service Request Statuses</h3>
          {insights?.requestStatuses && insights.requestStatuses.length > 0 ? (
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <SimpleChart type="bar" data={requestStatusesChartData} />
            </div>
          ) : (
            <NoData />
          )}
        </Col>
      </Row>

      <h3 className="mt-4">Users by Role (Table)</h3>
      {insights?.usersByRole && insights.usersByRole.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Role</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {insights.usersByRole.map((roleData) => (
              <tr key={roleData.role}>
                <td>{roleData.role}</td>
                <td>{roleData.count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoData />
      )}

      <h3>Service Request Statuses (Table)</h3>
      {insights?.requestStatuses && insights.requestStatuses.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {insights.requestStatuses.map((statusData) => (
              <tr key={statusData.status}>
                <td>{statusData.status}</td>
                <td>{statusData.count}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default AdminInsightsPage;