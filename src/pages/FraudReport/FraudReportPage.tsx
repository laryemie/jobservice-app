import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../components/Context/AuthContext';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

const FraudReportPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reportedUserId, setReportedUserId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const createFraudReportMutation = useMutation({
    mutationFn: (reportData: { reportedUserId: number; description: string }) =>
      api.post('/users/fraud-report', reportData),
    onSuccess: () => {
      setReportedUserId(null);
      setDescription('');
      queryClient.invalidateQueries({ queryKey: ['fraudReports'] });
      toast.success('Fraud report submitted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit fraud report');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedUserId || !description) {
      toast.error('Reported user ID and description are required');
      return;
    }
    if (!user) {
      toast.error('You must be logged in to submit a fraud report');
      return;
    }
    createFraudReportMutation.mutate({ reportedUserId, description });
  };

  if (!user) {
    return <Alert variant="warning">Please log in to submit a fraud report.</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Submit a Fraud Report</h2>
      <Form onSubmit={handleSubmit} className="form-container">
        <Form.Group className="mb-3">
          <Form.Label>Reported User ID</Form.Label>
          <Form.Control
            type="number"
            value={reportedUserId || ''}
            onChange={(e) => setReportedUserId(parseInt(e.target.value))}
            placeholder="Enter the ID of the user to report"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={createFraudReportMutation.isPending}>
          {createFraudReportMutation.isPending ? 'Submitting...' : 'Submit Report'}
        </Button>
      </Form>
    </div>
  );
};

export default FraudReportPage;