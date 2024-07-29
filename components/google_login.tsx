import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = () => {
    const handleLoginSuccess = (credentialResponse:any) => {
        console.log("Google login success. Credential response:", credentialResponse);
        
        if (credentialResponse && credentialResponse.credential) {
          console.log("Received credential:", credentialResponse.credential);
          // Your fetch call would go here
        } else {
          console.error("Credential response is missing or invalid");
        }
      };

  return (
    <GoogleOAuthProvider clientId="449925857021-obreiledjt3ajutc62bdfsqebrdi0r0q.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;