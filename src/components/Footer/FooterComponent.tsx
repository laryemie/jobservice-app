import React from 'react';
import { Container } from 'react-bootstrap';

const FooterComponent: React.FC = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <Container>
        <p>&copy; 2025 JobService. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default FooterComponent;