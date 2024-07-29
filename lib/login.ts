import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
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

// export const login_with_google = async (token: string) => {
//   try {
//     const response = await axios.post('http://127.0.0.1:8000/api/users/google-login/', {
//       token
//     });
//     const { tokens } = response.data;
//     localStorage.setItem('accessToken', tokens.access);
//     return true;
//   } catch (error) {
//     console.error('Login error:', error);
//     return false;
//   }
// };