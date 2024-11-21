import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography 
} from '@mui/material';

const CountryList = ({ countries, selectedCountry }) => {
  // Determine data to display
  const displayCountries = selectedCountry 
    ? [selectedCountry] 
    : countries.slice(0, 10);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {selectedCountry 
          ? `Details for ${selectedCountry.city}` 
          : 'Top 10 Cities'}
      </Typography>
      <List>
        {displayCountries.map((country, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={country.city}
              secondary={`Population: ${country.populationCounts?.[0]?.value.toLocaleString() || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CountryList;

