import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

interface FraudReport {
  id: number;
  reporter_id: number;
  reported_user_id: number;
  description: string;
  status: string;
  created_at: string;
  reporter_email: string;
  reported_email: string;
}

const AdminManageJobsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['fraudReports'],
    queryFn: async () => {
      const response = await api.get('/users/fraud-reports?status=pending');
      return response.data as FraudReport[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ reportId, status }: { reportId: number; status: 'resolved' | 'dismissed' }) =>
      api.put(`/users/fraud-reports/${reportId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraudReports'] });
      toast.success('Fraud report updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update fraud report');
    },
  });

  const handleUpdateStatus = (reportId: number, status: 'resolved' | 'dismissed') => {
    updateStatusMutation.mutate({ reportId, status });
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load fraud reports');
    return <Alert variant="danger">Failed to load fraud reports</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Manage Fraud Reports</h2>
      {reports && reports.length > 0 ? (
        <Table striped bordered hover className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter</th>
              <th>Reported User</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.reporter_email}</td>
                <td>{report.reported_email}</td>
                <td>{report.description}</td>
                <td>{report.status}</td>
                <td>{new Date(report.created_at).toLocaleString()}</td>
                <td>
                  {report.status === 'pending' && (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                        className="me-2"
                        disabled={updateStatusMutation.isPending}
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                        disabled={updateStatusMutation.isPending}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                </td>
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

export default AdminManageJobsPage;