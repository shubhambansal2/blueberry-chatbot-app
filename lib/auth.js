import axios from 'axios';

export const validateToken = async (token) => {
  try {
    const response = await axios.get('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/test-auth/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('accessToken');
      }
    }
    console.error('Token validation error:', error);
    return false;
  }
};

// Add a configured axios instance for consistent headers
export const api = axios.create({
  baseURL: 'https://mighty-dusk-63104-f38317483204.herokuapp.com/api'
});

// Add request interceptor to always include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      // Let the AuthGuard handle the redirect
    }
    return Promise.reject(error);
  }
);