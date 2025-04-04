import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

const WorkerProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: { skills: string; experience: string }) =>
      api.put('/worker/profile', profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast.success('Profile updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ skills, experience });
  };

  return (
    <div className="page-container">
      <h2>Update Profile</h2>
      <Form onSubmit={handleSubmit} className="form-container">
        <Form.Group className="mb-3">
          <Form.Label>Skills</Form.Label>
          <Form.Control
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Enter your skills (e.g., Plumbing, Electrical)"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Experience</Form.Label>
          <Form.Control
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Enter your experience (e.g., 5 years)"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
        </Button>
      </Form>
    </div>
  );
};

export default WorkerProfilePage;