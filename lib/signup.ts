interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  
  interface Tokens {
    refresh: string;
    access: string;
}

interface SignupResponse {
    tokens: Tokens;
    user_id: number;
    email: string;
}
  
  async function signup(data: SignupData): Promise<SignupResponse> {
    const apiUrl = 'https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/signup/';
  
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