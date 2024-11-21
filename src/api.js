import axios from 'axios';

// Fetch all countries and their capitals
export const fetchCountriesWithCapitals = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/capital');
    return response.data.data; // Assuming the response contains the 'data' object with countries and capitals.
  } catch (error) {
    console.error('Error fetching countries with capitals:', error);
    throw error;
  }
};

// Fetch a single country with flag (POST request)
export const fetchCountryFlag = async (countryCode) => {
  try {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
      country: countryCode,  // Sending the country code as part of the request body
    });
    return response.data.data; // Assuming the response contains the flag image data.
  } catch (error) {
    console.error('Error fetching country flag:', error);
    throw error;
  }
};

// Fetch cities and their population data
export const fetchCitiesWithPopulation = async () => {
  try {
    const response = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities');
    return response.data.data; // Assuming the response contains the 'data' object with city population data.
  } catch (error) {
    console.error('Error fetching cities population data:', error);
    throw error;
  }
};





