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
    console.error('Token validation error:', error);
    return false;
  }
};