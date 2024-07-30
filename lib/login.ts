import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/login/', {
      email,
      password,
    });
    const { tokens } = response.data;
    localStorage.setItem('accessToken', tokens.access);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};