"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Container } from "../../../components/Container";
import { GridPattern } from "../../../components/GridPattern";
import Logo from "../../../components/Logo";
import GoogleLoginComponent from "../../../components/google_login";
import { signup } from '../../../lib/signup';
import GlobalLoadingOverlay from '../../../components/GlobalLoadingOverlay';

const generateUsername = (firstName: string, lastName: string) => {
  const randomNumber = Math.floor(100 + Math.random() * 900);
  return `${firstName}${lastName}${randomNumber}`;
};

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
  });

  const router = useRouter();

  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const username = generateUsername(formData.firstName, formData.lastName);
      console.log('Generated username:', username);
    }
  }, [formData.firstName, formData.lastName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const username = generateUsername(formData.firstName, formData.lastName);
    const updatedFormData = {
      ...formData,
      username,
    };

    try {
      const response = await signup(updatedFormData);
      if (response.tokens) {
        console.log('Signup successful:', response.user_id);
        router.push('/login?fromsignup=1');
      } else {
        console.error('Signup failed:', response.user_id);
        window.alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      window.alert('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pattern = {
    y: -6,
    squares: [
      [-1, 2],
      [1, 3],
      ...Array.from({ length: 10 }, () => [
        Math.floor(Math.random() * 20) - 10,
        Math.floor(Math.random() * 20) - 10,
      ]),
    ],
  };

  return (
    <Container>
      {isLoading && <GlobalLoadingOverlay message="Creating your account..." />}
      <div className="min-h-[60rem] flex justify-center items-start">
        <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
          <GridPattern
            width={120}
            height={120}
            x="50%"
            className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-5deg] fill-tertiary/[0.05] stroke-gray-100 fill-primary stroke-gray-100"
            {...pattern}
          />
        </div>
        <div className="px-10 py-20 rounded-xl bg-white shadow-lg w-[40rem] mt-40 md:mt-40 mx-4 relative z-10">
        <div className="flex flex-col items-center justify-center">
            <Logo textClassName="items-center justify-center text-zinc-700" />
          </div>
          
          <h1 className="my-8 text-xl text-zinc-700 text-center">
            Sign up to Purpleberry AI
          </h1>
          
       

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                name="firstName"
                className="w-1/2 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="lastName"
                className="w-1/2 rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <input
              type="email"
              name="email"
              className="w-full rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent mb-6"
              placeholder="Business email address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full rounded-xl shadow-sm border border-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"/>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                    <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full bg-black text-white rounded-xl py-2 px-4 hover:bg-gray-700 transition-colors"
              >
                Sign up
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center items-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>
              
              <div className="w-full flex justify-center items-center">
                <GoogleLoginComponent />
              </div>
            </div>
          </form>

          {/* <p className="text-sm text-gray-600 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">terms of service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">privacy policy</a>
          </p> */}

          <Link
            href="/login"
            className="text-gray-600 block mt-4 text-sm text-center"
          >
            Already have an account?{' '}
            <span className="text-blue-600 hover:underline">Sign in here</span>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default SignUp;


   {/* <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-700 mb-4">Join the global AI revolution today</h2>
            <ul className="space-y-2">
              <li className="flex items-center text-zinc-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                7-day trial of the premium plan
              </li>
              <li className="flex items-center text-zinc-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card or payment required
              </li>
              <li className="flex items-center text-zinc-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Easy to use, no coding skills required
              </li>
            </ul>
          </div> */}