import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../components/Context/AuthContext';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

interface Payment {
  id: number;
  service_request_id: number;
  client_id: number;
  worker_id: number;
  amount: number;
  status: string;
  created_at: string;
  description: string;
}

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [serviceRequestId, setServiceRequestId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await api.get('/payments/history');
      return response.data as Payment[];
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: (paymentData: { serviceRequestId: number; amount: number }) =>
      api.post('/payments/create', paymentData),
    onSuccess: () => {
      setServiceRequestId(null);
      setAmount(null);
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create payment');
    },
  });

  const completePaymentMutation = useMutation({
    mutationFn: (paymentId: number) => api.post(`/payments/${paymentId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment completed successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to complete payment');
    },
  });

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceRequestId || !amount) {
      toast.error('Service request ID and amount are required');
      return;
    }

    createPaymentMutation.mutate({ serviceRequestId, amount });
  };

  const handleCompletePayment = (paymentId: number) => {
    completePaymentMutation.mutate(paymentId);
  };

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load payment history');
    return <Alert variant="danger">Failed to load payment history</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Payments</h2>
      {user?.role === 'client' && (
        <>
          <h3>Create Payment</h3>
          <Form onSubmit={handleCreatePayment} className="form-container mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Service Request ID</Form.Label>
              <Form.Control
                type="number"
                value={serviceRequestId || ''}
                onChange={(e) => setServiceRequestId(parseInt(e.target.value))}
                placeholder="Enter service request ID"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Enter amount"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending ? 'Creating...' : 'Create Payment'}
            </Button>
          </Form>
        </>
      )}

      <h3>Payment History</h3>
      {payments && payments.length > 0 ? (
        <Table striped bordered hover className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Request</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created At</th>
              {user?.role === 'client' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.description}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.status}</td>
                <td>{new Date(payment.created_at).toLocaleString()}</td>
                {user?.role === 'client' && (
                  <td>
                    {payment.status === 'pending' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleCompletePayment(payment.id)}
                        disabled={completePaymentMutation.isPending}
                      >
                        {completePaymentMutation.isPending ? 'Completing...' : 'Complete'}
                      </Button>
                    )}
                  </td>
                )}
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

export default PaymentsPage;