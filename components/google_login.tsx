import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import GlobalLoadingOverlay from './GlobalLoadingOverlay';

const GoogleLoginComponent = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  
    const HandleLoginSuccess = async (credentialResponse:any) => {
      setIsLoading(true); // Start loading
      console.log("Google login success. Credential response:", credentialResponse.credential);
      
      const received_token = credentialResponse.credential;

      console.log(received_token)

      if (!received_token) {
        console.error('No credential found in the response');
        setIsLoading(false); // Stop loading on error
        return;
      }

      try {
        const response = await fetch('https://mighty-dusk-63104-f38317483204.herokuapp.com/api/users/google-login/', {
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
        console.log("Backend response data:", data);
        
        // Store tokens and user data
        const accessToken = data.tokens.access;
        const refreshToken = data.tokens.refresh;
        const user = data.user_id;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', user);

        // Use window.location for consistent loading transition
        window.location.href = '/';
      } catch (error) {
        console.error('Login failed:', error);
        setIsLoading(false); // Stop loading on error
      }
    };

    return (
      <>
        {isLoading && <GlobalLoadingOverlay message="Setting up your workspace..." />}
        <div className="font-bold rounded-lg">
          <GoogleOAuthProvider clientId="449925857021-obreiledjt3ajutc62bdfsqebrdi0r0q.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={HandleLoginSuccess}
              onError={() => {
                console.log('Login Failed');
                setIsLoading(false); // Stop loading on error
              }}
            />
          </GoogleOAuthProvider>
        </div>
      </>
    );
};

export default GoogleLoginComponent;