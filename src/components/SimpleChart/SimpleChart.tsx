import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ChartProps {
  type: 'pie' | 'bar';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
}

const SimpleChart: React.FC<ChartProps> = ({ type, data }) => {
  return type === 'pie' ? <Pie data={data} /> : <Bar data={data} />;
};

export default SimpleChart;