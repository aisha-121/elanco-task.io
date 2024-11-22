import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  Autocomplete 
} from '@mui/material';
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

// Comprehensive list of countries
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
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 
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
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/population');
        const data = await response.json();

        // Strict filtering using whitelist of countries
        const processedData = data.data
          .filter(item => {
            // Exact match to the list of valid countries
            return VALID_COUNTRIES.includes(item.country) &&
              item.populationCounts?.length > 0;
          })
          .map(country => ({
            name: country.country,
            population: country.populationCounts[country.populationCounts.length - 1]?.value || 0,
            year: country.populationCounts[country.populationCounts.length - 1]?.year || 'N/A'
          }))
          .sort((a, b) => b.population - a.population);

        setCountries(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Rest of the component remains the same as in previous implementations
  const countryNames = [...countries]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(country => country.name);

  const handleSearch = (event, newValue) => {
    setSearchTerm(newValue || '');
    if (newValue) {
      const country = countries.find(c => c.name === newValue);
      setSelectedCountry(country || null);
    } else {
      setSelectedCountry(null);
    }
  };

  const chartData = {
    labels: (selectedCountry ? [selectedCountry] : countries.slice(0, 10))
      .map(country => country.name),
    datasets: [{
      label: 'Population',
      data: (selectedCountry ? [selectedCountry] : countries.slice(0, 10))
        .map(country => country.population),
      backgroundColor: 'rgba(255, 182, 193, 0.6)',
      borderColor: 'rgba(255, 182, 193, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedCountry 
          ? `Population of ${selectedCountry.name}` 
          : 'Top 10 Most Populated Countries',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  // Render method remains the same as in previous implementations
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Global Population Statistics
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
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
          </Grid>

          {loading ? (
            <Grid item xs={12}>
              <Typography align="center">Loading data...</Typography>
            </Grid>
          ) : (
            <>
              <Grid item md={6} xs={12}>
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
              </Grid>
              <Grid item md={6} xs={12}>
                <Card>
                  <CardContent>
                    <Bar data={chartData} options={chartOptions} />
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default App;