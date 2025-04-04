import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../../Context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

describe('ProtectedRoute', () => {
  it('redirects to login if user is not authenticated', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('redirects to dashboard if user role is not allowed', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    const authContext = React.useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext not found');
    authContext.login('fake-token', { id: 1, email: 'test@example.com', role: 'client' });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/dashboard page/i)).toBeInTheDocument();
  });

  it('renders children if user role is allowed', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    const authContext = React.useContext(AuthContext);
    if (!authContext) throw new Error('AuthContext not found');
    authContext.login('fake-token', { id: 1, email: 'test@example.com', role: 'client' });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });
});