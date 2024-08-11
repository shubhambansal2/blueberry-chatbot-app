import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/login/', {
      email,
      password,
    });
    const { tokens, user_id } = response.data;
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('user', user_id);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};