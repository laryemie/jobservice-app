import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">JobService</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {user.role === 'client' && (
                  <>
                    <Nav.Link as={Link} to="/request-service">Request Service</Nav.Link>
                    <Nav.Link as={Link} to="/view-workers">View Workers</Nav.Link>
                  </>
                )}
                {user.role === 'worker' && (
                  <>
                    <Nav.Link as={Link} to="/worker-profile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/worker-requests">Requests</Nav.Link>
                  </>
                )}
                {(user.role === 'client' || user.role === 'worker') && (
                  <>
                    <Nav.Link as={Link} to="/payments">Payments</Nav.Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin/users">Manage Users</Nav.Link>
                    <Nav.Link as={Link} to="/admin/jobs">Manage Jobs</Nav.Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          )}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;