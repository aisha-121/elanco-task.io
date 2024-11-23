import React, { useState, useEffect } from 'react';
import './styles.css';  // import the styles.css file

import { 
  Container, 
  Typography, 
  TextField, 
  Card, 
  CardContent, 
  Box,
  Autocomplete 
} from '@mui/material'; // imported material ui components for ui elements
import { Bar } from 'react-chartjs-2'; // to render bar chart
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js'; // for configuring chart settings

// registering the chart.js components that will be used 
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

// comprehensive list of countries to filter out unwanted groups
const VALID_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'The Bahamas', 
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 
  'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 
  'Comoros', 'Congo, Democratic Republic of the', 'Congo, Republic of the', 
  'Costa Rica', 'Côte d\'Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor (Timor-Leste)', 
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'The Gambia', 
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 
  'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 
  'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 
  'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia, Federated States of', 
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 
  'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 
  'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 
  'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
  'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Sudan, South', 'Suriname', 
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 
  'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const App = () => {
  // state variables
  const [countries, setCountries] = useState([]); // holds list and data of the countries and their population
  const [loading, setLoading] = useState(true); // tracks loading state of the api
  const [searchTerm, setSearchTerm] = useState(''); // stores the term searched for from user input
  const [selectedCountry, setSelectedCountry] = useState(null); // stores selected country for detailed view

  // fetching data from api 
  useEffect(() => { // side effect using useEffect
    const fetchData = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/population');
        const data = await response.json();

        // filtering the data using the VALID_COUNTRIES list to ensure only valid countries are included
        const processedData = data.data
          .filter(item => {
            // only include countries that are in the VALID_COUNTRIES whitelist
            return VALID_COUNTRIES.includes(item.country) &&
              item.populationCounts?.length > 0;
          })
          .map(country => ({
            name: country.country, // country name
            population: country.populationCounts[country.populationCounts.length - 1]?.value || 0, // gets latest population data
            year: country.populationCounts[country.populationCounts.length - 1]?.year || 'N/A' // year of population data
          }))
          .sort((a, b) => b.population - a.population); // sorting the countries by population in descending order

        setCountries(processedData); // setting the countries data to state
        setLoading(false); // setting loading state to false after data is fetched
      } catch (error) {
        console.error('Failed to fetch data:', error); // error handling
        setLoading(false); // setting loading state to false in case of error
      }
    };

    fetchData(); // calling function to fetch data
  }, []); // empty array - this effect only runs once when the component mounts

  // sorted list of country names for search bar
  const countryNames = [...countries]
    .sort((a, b) => a.name.localeCompare(b.name)) // sorting alphabetically by country name
    .map(country => country.name); // extracting the names of countries for the search bar

  // handling search input changes
  const handleSearch = (event, newValue) => {
    setSearchTerm(newValue || ''); // updating search term
    if (newValue) {
      const country = countries.find(c => c.name === newValue); // finding the country by name
      setSelectedCountry(country || null); // set selected country or null if not found
    } else {
      setSelectedCountry(null); // if the search term is empty, reset selected country
    }
  };

  // chart data for top 10 most populated countries or selected country
  const chartData = {
    labels: (selectedCountry ? [selectedCountry] : countries.slice(0, 10)) // country selected data is shown or top 10 if no country is selected
      .map(country => country.name), // labelling bar chart with relevant country name
    datasets: [{
      label: 'Population', // label for dataset
      data: (selectedCountry ? [selectedCountry] : countries.slice(0, 10)) // population numbers - data to plot
        .map(country => country.population),
      backgroundColor: 'rgba(255, 182, 193, 0.6)', // pink bar chart
      borderColor: 'rgba(255, 182, 193, 1)', // pink border for bar chart
      borderWidth: 1, // width of border for bar chart
    }]
  };

  // customisation of appearance of the chart
  const chartOptions = {
    responsive: true, // making the chart responsive to the window size so it adapts to it
    plugins: {
      legend: {
        position: 'top', // displaying legend at the top
      },
      title: {
        display: true, // displaying chart title
        text: selectedCountry 
          ? `Population of ${selectedCountry.name}` // if a country is selected, it shows its name in the title
          : 'Top 10 Most Populated Countries', // otherwise, it shows "Top 10 Most Populated Countries"
      },
    },
    scales: {
      y: {
        beginAtZero: true, // starting the y axis at 0
        ticks: {
          callback: function(value) {
            return (value / 1000000).toFixed(1) + 'M'; // showing population value in millions
          }
        }
      }
    }
  };

  return (
  // main container for the app
  // this part of the app:
  // - shows the app's title ("Global Population Statistics")
  // - displays a search bar to find countries by name
  // - shows a loading message until data is fetched
  // - lists countries with their population info
  // - shows a bar chart with population data for the top 10 countries or a selected country
  // - uses Material-UI components like Container, Box, and Card for layout and styling
  // - manages app states like loading, search term, and selected country

    <Container maxWidth="lg"> 
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Population Statistics
        </Typography>

        <Box mb={3}>
          <Card>
            <CardContent>
              <Autocomplete
                options={countryNames}
                value={searchTerm}
                onChange={handleSearch}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Search Countries" 
                    variant="outlined" 
                    fullWidth
                  />
                )}
              />
            </CardContent>
          </Card>
        </Box>

        {loading ? (
          <Box mb={3}>
            <Typography align="center">Loading data...</Typography>
          </Box>
        ) : (
          <>
            <Box mb={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedCountry 
                      ? `Details for ${selectedCountry.name}` 
                      : 'Top 10 Most Populated Countries'}
                  </Typography>
                  {(selectedCountry ? [selectedCountry] : countries.slice(0, 10))
                    .map((country, index) => (
                      <Box key={country.name} py={1} borderBottom={1} borderColor="divider">
                        <Typography>
                          {index + 1}. {country.name}
                        </Typography>
                        <Typography color="textSecondary">
                          Population: {country.population.toLocaleString()} ({country.year})
                        </Typography>
                      </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>

            <Box mb={3}>
              <Card>
                <CardContent>
                  <Bar data={chartData} options={chartOptions} />
                </CardContent>
              </Card>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default App;
