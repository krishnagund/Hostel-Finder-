import axios from 'axios';

export const getCoordinatesFromAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'rentIndiaApp/1.0 (kgund254@mtroyal.ca)'
      }
    });

    const results = response.data;

    if (results.length > 0) {
      const { lat, lon } = results[0];
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      };
    } else {
      console.log("No geocode results found for address:", address);
      return { latitude: null, longitude: null };
    }
  } catch (error) {
    console.error('Nominatim geocoding error:', error.message);
    return { latitude: null, longitude: null };
  }
};
