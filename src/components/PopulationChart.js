import React from 'react';
import { Bar } from 'react-chartjs-2';
import './styles.css';  // import the styles.css file

import { Card, CardContent } from '@mui/material'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PopulationChart = ({ countries }) => {
  // prepare chart data
  const chartData = {
    labels: countries.map(country => country.name),  // country names as labels
    datasets: [
      {
        label: 'Population',  // dataset label
        data: countries.map(country => country.population),  // population data
        backgroundColor: 'rgba(54, 162, 235, 0.6)',  // pink bar chart
        borderColor: 'rgba(54, 162, 235, 1)',  // pink border 
        borderWidth: 1,  // border width
      },
    ],
  };

  // chart configuration options
  const options = {
    responsive: true,  // makes the chart responsive
    plugins: {
      legend: {
        position: 'top',  // legend on top
      },
      title: {
        display: true,  // show chart title
        text: countries.length === 1 ? 'country population' : 'top 10 countries by population',  // dynamic title
      },
    },
    scales: {
      y: {
        beginAtZero: true,  // start y-axis at 0
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              notation: 'compact',  // compact number formatting
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
        {/* render the bar chart */}
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
};

export default PopulationChart;
