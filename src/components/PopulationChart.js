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
;
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const PopulationChart = ({ countries, selectedCountry }) => {
  // Determine data to display
  const displayCountries = selectedCountry 
    ? [selectedCountry] 
    : countries.slice(0, 10);

  const chartData = {
    labels: displayCountries.map(country => country.city),
    datasets: [
      {
        label: 'Population',
        data: displayCountries.map(country => 
          country.populationCounts?.[0]?.value || 0
        ),
        backgroundColor: 'rgba(255, 182, 193, 0.6)', // Baby pink with transparency
        borderColor: 'rgba(255, 182, 193, 1)',       // Solid baby pink for border
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
        text: selectedCountry 
          ? `Population of ${selectedCountry.city}` 
          : 'Top 10 Cities Population',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default PopulationChart;



