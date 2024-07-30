import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

const GoogleLoginComponent = () => {
    const router = useRouter();
  
    const HandleLoginSuccess = async (credentialResponse:any) => {
      console.log("Google login success. Credential response:", credentialResponse.credential);
      
      const { received_token } = credentialResponse.credential;

      console.log(received_token)
      
      if (!received_token) {
        console.error('No credential found in the response');
        return;
      }
      try {
        const response = await fetch('http://127.0.0.1:8000/api/users/google-login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: received_token }),
        });

        
  
        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    };

  return (
    <GoogleOAuthProvider clientId="449925857021-obreiledjt3ajutc62bdfsqebrdi0r0q.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={HandleLoginSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;