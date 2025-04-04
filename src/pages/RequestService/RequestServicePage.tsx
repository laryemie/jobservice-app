import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

const RequestServicePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [description, setDescription] = useState('');

  const requestServiceMutation = useMutation({
    mutationFn: (description: string) => api.post('/client/request-service', { description }),
    onSuccess: () => {
      setDescription('');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Service request created successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create service request');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast.error('Description is required');
      return;
    }
    requestServiceMutation.mutate(description);
  };

  return (
    <div className="page-container">
      <h2>Request a Service</h2>
      <Form onSubmit={handleSubmit} className="form-container">
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the service you need..."
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={requestServiceMutation.isPending}>
          {requestServiceMutation.isPending ? 'Submitting...' : 'Submit Request'}
        </Button>
      </Form>
    </div>
  );
};

export default RequestServicePage;