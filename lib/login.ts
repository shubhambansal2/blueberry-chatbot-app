import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem('accessToken', token);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};