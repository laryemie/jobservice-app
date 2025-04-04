import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">JobService</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  {user.role === 'client' && (
                    <>
                      <Nav.Link as={Link} to="/request-service">Request Service</Nav.Link>
                      <Nav.Link as={Link} to="/view-workers">View Workers</Nav.Link>
                      <Nav.Link as={Link} to="/payments">Payments</Nav.Link>
                      <Nav.Link as={Link} to="/fraud-report">Report Fraud</Nav.Link>
                    </>
                  )}
                  {user.role === 'worker' && (
                    <>
                      <Nav.Link as={Link} to="/worker-profile">Profile</Nav.Link>
                      <Nav.Link as={Link} to="/worker-requests">Requests</Nav.Link>
                      <Nav.Link as={Link} to="/payments">Payments</Nav.Link>
                      <Nav.Link as={Link} to="/fraud-report">Report Fraud</Nav.Link>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      <Nav.Link as={Link} to="/admin/users">Manage Users</Nav.Link>
                      <Nav.Link as={Link} to="/admin/jobs">Manage Jobs</Nav.Link>
                      <Nav.Link as={Link} to="/admin/insights">Insights</Nav.Link>
                    </>
                  )}
                  <Nav.Link as={Link} to="/communication/1">Messages</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
            {user && (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">{children}</Container>
    </>
  );
};

export default Layout;