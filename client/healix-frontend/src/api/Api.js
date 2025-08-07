
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';


export const fetchData= async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}/${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    };      
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);

    throw error.response ? error.response.data : new Error('Network Error');
  }
};

