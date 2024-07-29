import axios from 'axios';

export const validateToken = async (token) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/users/test-auth/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};