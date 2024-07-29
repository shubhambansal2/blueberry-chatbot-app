'use client'
import React, { useState,useEffect } from 'react';
import { signup } from '../../lib/signup';
import { useRouter } from 'next/navigation'; 
import GoogleLoginComponent from '../../components/google_login';

const generateUsername = (firstName: string, lastName:string) => {
    const randomNumber = Math.floor(100 + Math.random() * 900); // Generate a random 3-digit number
    return `${firstName}${lastName}${randomNumber}`;
  };


const SignUpPage: React.FC = () => {
    // const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        username: '', // Added username to formData
      });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const username = generateUsername(formData.firstName, formData.lastName);
      console.log('Generated username:', username);
      // You can also set the username in the state or use it as needed
    }
  }, [formData.firstName, formData.lastName]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = generateUsername(formData.firstName, formData.lastName);

    // Update formData with the generated username
    const updatedFormData = {
      ...formData,
      username,
    };

    try {
        const response = await signup(updatedFormData); // Assume `signup` is defined elsewhere
        if (response.tokens) {
          console.log('Signup successful:', response.user_id);
          // Redirect to login page on successful signup
          router.push('/login?fromsignup=1');
        } else {
          console.error('Signup failed:', response.user_id);
          // Show an error alert on signup failure
          window.alert('Signup failed. Please try again.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        // Show an error alert on unexpected error
        window.alert('An error occurred during signup. Please try again.');
      }
    };

  return (
    <div  className="bg-white min-h-screen">
    <div className="bg-white min-h-screen">
      <header className="">
        <h1 className="text-2xl font-bold text-blue-900 flex items-center ">
          <span className="w-6 h-6 bg-blue-600 rounded-full mr-2 mt-2 "></span>
          Blueberry
        </h1>
      </header>
      <main className="flex flex-col md:flex-row gap-8 mt-80 ml-10 mr-10">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-black">Join the global AI revolution today with Blueberry</h2>
          <ul className="space-y-2">
            <li className="flex items-center text-black">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              7-day trial of the premium plan
            </li>
            <li className="flex items-center text-black">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No credit card or payment required
            </li>
            <li className="flex items-center text-black">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Easy to use, no coding skills required
            </li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="md:w-1/2 space-y-4">
          <div className="flex gap-4 text-black">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Business email address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded text-black"
          />

        <div className="mb-6 relative">
            <input
                className="w-full p-2 border rounded text-black"
                type={showPassword ? "text" : "password"}
                name = "password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
            />
            <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={togglePasswordVisibility}
            >
                {showPassword ? (
                <svg className="h-6 w-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"/>
                </svg>
                ) : (
                <svg className="h-6 w-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/>
                </svg>
                )}
            </button>
        </div>
          <button type="submit" className="w-full p-2 bg-black text-white rounded">Sign up</button>
          <p className="text-sm text-gray-600 text-center">
            By continuing, you agree to our <a href="#" className="underline">terms of service</a> and{' '}
            <a href="#" className="underline">privacy policy</a>
          </p>
        </form>
        <div className="App">
        <header className="App-header">
        <h1>Google Login with React</h1>
        <GoogleLoginComponent />
        </header>
        </div>
      </main>
    </div>

    </div>
  );
};

export default SignUpPage;
