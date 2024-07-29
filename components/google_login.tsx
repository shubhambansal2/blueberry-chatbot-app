import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

const GoogleLoginComponent = () => {
    const HandleLoginSuccess = (credentialResponse:any) => {
        const router = useRouter();
        console.log("Google login success. Credential response:", credentialResponse);
        
        if (credentialResponse && credentialResponse.credential) {
          console.log("Received credential:", credentialResponse.credential);
          // Your fetch call would go here
          fetch('http://127.0.0.1:8000/api/users/google-login/', {
            method: 'POST',  // Typically, login is done via POST
            headers: {
                'Authorization': `Bearer ${credentialResponse.credential}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: credentialResponse.credential })  // Include token in body if needed
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.tokens && data.tokens.access) {
                // Set the access token in local storage
                localStorage.setItem('access_token', data.tokens.access);

                // Redirect to home page
                router.push('/');  // Adjust the path as needed
            }
        })
        .catch(error => console.error('Error:', error));

        
//     localStorage.setItem('accessToken', tokens.access);
        } else {
          console.error("Credential response is missing or invalid");
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