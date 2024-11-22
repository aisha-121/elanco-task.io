import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PopulationChart = ({ countries }) => {
  const chartData = {
    labels: countries.map(country => country.name),
    datasets: [
      {
        label: 'Population',
        data: countries.map(country => country.population),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: countries.length === 1 ? 'Country Population' : 'Top 10 Countries by Population',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value);
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

export default PopulationChart;