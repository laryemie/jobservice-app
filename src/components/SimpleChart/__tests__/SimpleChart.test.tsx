import React from 'react';
import { render, screen } from '@testing-library/react';
import SimpleChart from '../SimpleChart';

describe('SimpleChart', () => {
  const pieData = {
    labels: ['Client', 'Worker', 'Admin'],
    datasets: [
      {
        label: 'Users by Role',
        data: [10, 20, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Pending', 'Accepted', 'Completed'],
    datasets: [
      {
        label: 'Service Requests by Status',
        data: [15, 10, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  it('renders a pie chart', () => {
    render(<SimpleChart type="pie" data={pieData} />);
    expect(screen.getByRole('img')).toBeInTheDocument(); // Chart.js renders a canvas element
  });

  it('renders a bar chart', () => {
    render(<SimpleChart type="bar" data={barData} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});