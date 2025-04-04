import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Alert } from 'react-bootstrap';
import api from '../../services/api';
import Loading from '../../components/Spinner/Loading';
import NoData from '../../components/NoData/NoData';
import { toast } from 'react-toastify';
import '../SharedStyles.scss';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

const AdminManageUsersPage: React.FC = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data as User[];
    },
  });

  if (isLoading) return <Loading />;
  if (error) {
    toast.error('Failed to load users');
    return <Alert variant="danger">Failed to load users</Alert>;
  }

  return (
    <div className="page-container">
      <h2>Manage Users</h2>
      {users && users.length > 0 ? (
        <Table striped bordered hover className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
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

export default AdminManageUsersPage;