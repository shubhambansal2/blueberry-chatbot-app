interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  
  interface SignupResponse {
    token: string;
    user_id: number;
    email: string;
  }
  
  async function signup(data: SignupData): Promise<SignupResponse> {
    const apiUrl = 'http://127.0.0.1:8000/api/users/signup/'; // Replace with your actual API endpoint
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Signup failed');
      }
  
      const result: SignupResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }
  
  export { signup };