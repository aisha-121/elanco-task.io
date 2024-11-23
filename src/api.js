import axios from 'axios';
import './styles.css';  // import the styles.css file

// fetch all countries and their capitals
export const fetchCountriesWithCapitals = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/capital');
    return response.data.data;  // return the countries data
  } catch (error) {
    console.error('error fetching countries with capitals:', error);  // log error if any
    throw error;
  }
};

// fetch country flag by country code (POST request)
export const fetchCountryFlag = async (countryCode) => {
  try {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
      country: countryCode,  // send country code in the request
    });
    return response.data.data;  // return flag data
  } catch (error) {
    console.error('error fetching country flag:', error);  // log error if any
    throw error;
  }
};

// fetch cities and their population data
export const fetchCitiesWithPopulation = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities');
    return response.data.data;  // return city population data
  } catch (error) {
    console.error('error fetching cities population data:', error);  // log error if any
    throw error;
  }
};






