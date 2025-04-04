import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Alert, Form, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

interface Worker {
  id: number;
  user_id: number;
  skills: string;
  experience: string | null;
  rating: number;
  created_at: string;
  email: string;
}

const ViewWorkersPage: React.FC = () => {
  const [searchSkills, setSearchSkills] = useState('');
  const [minRating, setMinRating] = useState<number | ''>('');

  const { data: workers, isLoading, error } = useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const response = await api.get('/client/workers');
      return response.data as Worker[];
    },
  });

  const filteredWorkers = workers?.filter((worker) => {
    const matchesSkills = searchSkills
      ? worker.skills.toLowerCase().includes(searchSkills.toLowerCase())
      : true;
    const matchesRating = minRating ? worker.rating >= minRating : true;
    return matchesSkills && matchesRating;
  });

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load workers');
    return <Alert variant="danger">Failed to load workers</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Available Workers</h2>
      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Search by Skills</Form.Label>
              <Form.Control
                type="text"
                value={searchSkills}
                onChange={(e) => setSearchSkills(e.target.value)}
                placeholder="Enter skills (e.g., Plumbing)"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Rating</Form.Label>
              <Form.Select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value ? parseFloat(e.target.value) : '')}
              >
                <option value="">All Ratings</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      {filteredWorkers && filteredWorkers.length > 0 ? (
        <Table striped bordered hover className="table-container">
          <thead>
            <tr>
              <th>Email</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Rating</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkers.map((worker) => (
              <tr key={worker.id}>
                <td>{worker.email}</td>
                <td>{worker.skills}</td>
                <td>{worker.experience || 'N/A'}</td>
                <td>{worker.rating.toFixed(1)}</td>
                <td>{new Date(worker.created_at).toLocaleString()}</td>
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

export default ViewWorkersPage;