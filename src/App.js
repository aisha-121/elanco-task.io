import React, { useState, useEffect, useMemo } from 'react';
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
import { fetchCitiesWithPopulation } from './api';  // Import the correct API function
import CountryList from './components/CountryList';
import PopulationChart from './components/PopulationChart';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCitiesWithPopulation();  // Use the correct API function here
        setCountries(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized filtered countries
  const filteredCountries = useMemo(() => {
    return countries.filter(country => 
      country.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm]);

  // Prepare unique country options for autocomplete
  const countryOptions = useMemo(() => {
    return [...new Set(countries.map(c => c.city))];
  }, [countries]);

  const handleCountrySelect = (event, value) => {
    if (value) {
      const country = countries.find(c => c.city === value);
      setSelectedCountry(country || null);
      setSearchTerm(value);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Global Population Insights
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Autocomplete
                  options={countryOptions}
                  value={searchTerm}
                  onInputChange={handleCountrySelect}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Search Cities" 
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
                    <CountryList 
                      countries={filteredCountries} 
                      selectedCountry={selectedCountry}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item md={6} xs={12}>
                <Card>
                  <CardContent>
                    <PopulationChart 
                      countries={filteredCountries} 
                      selectedCountry={selectedCountry}
                    />
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

