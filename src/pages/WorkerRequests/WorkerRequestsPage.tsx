import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

interface ServiceRequest {
  id: number;
  client_id: number;
  worker_id: number | null;
  description: string;
  status: string;
  created_at: string;
  client_user_id: number;
  client_email: string;
}

const WorkerRequestsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['workerRequests'],
    queryFn: async () => {
      const response = await api.get('/worker/requests/available');
      return response.data as ServiceRequest[];
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: number) => api.post(`/worker/requests/${requestId}/accept`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerRequests'] });
      queryClient.invalidateQueries({- queryKey: ['dashboard'] });
      toast.success('Service request accepted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to accept request');
    },
  });

  const handleAcceptRequest = (requestId: number) => {
    acceptRequestMutation.mutate(requestId);
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load requests');
    return <Alert variant="danger">Failed to load requests</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Available Service Requests</h2>
      {requests && requests.length > 0 ? (
        <Table striped bordered hover className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Email</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.client_email}</td>
                <td>{request.description}</td>
                <td>{request.status}</td>
                <td>{new Date(request.created_at).toLocaleString()}</td>
                <td>
                  {request.status === 'pending' && !request.worker_id && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={acceptRequestMutation.isPending}
                    >
                      {acceptRequestMutation.isPending ? 'Accepting...' : 'Accept'}
                    </Button>
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

export default WorkerRequestsPage;