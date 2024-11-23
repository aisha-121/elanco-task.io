import React from 'react';
import './styles.css';  // import the styles.css file

import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography 
} from '@mui/material';

const CountryList = ({ countries, selectedCountry }) => {
  // determine which countries to display based on selection
  const displayCountries = selectedCountry 
    ? [selectedCountry] 
    : countries.slice(0, 10);

  return (
    <>
      {/* display the title depending on whether a country is selected */}
      <Typography variant="h6" gutterBottom>
        {selectedCountry 
          ? `details for ${selectedCountry.city}` 
          : 'top 10 cities'}
      </Typography>
      <List>
        {/* map through the countries to display their data */}
        {displayCountries.map((country, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={country.city}  // country city
              secondary={`Population: ${country.populationCounts?.[0]?.value.toLocaleString() || 'N/A'}`}  // population
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CountryList;


