"use client";
import Button from "../../../components/Button";
import { Container } from "../../../components/Container"
import { GridPattern } from "../../../components/GridPattern";
import Logo from "../../../components/Logo";
import { login } from "../../../lib/login";
import GoogleLoginComponent from "../../../components/google_login";
import GlobalLoadingOverlay from "../../../components/GlobalLoadingOverlay";


import type { NextPage } from "next";
import Link from "next/link";
import {
  AiOutlineGithub,
  AiOutlineGoogle,
  AiOutlineTwitter,
} from "react-icons/ai";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const SignIn: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidcredentials, setInvalidcredentials] = useState<boolean>(false);

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
        setInvalidcredentials(true);
      }
    } catch (error) {
      setError('An error occurred during sign in');
      setIsLoading(false);
    }
  };

  const socialButtons = [

    {
      name: "Google",
      icon: <AiOutlineGoogle className="text-red-500 h-5 w-5" />,
      onClick: () => {},
    },
  ];
  const pattern = {
    y: -6,
    squares: [
      [-1, 2],
      [1, 3],
      // Random values between -10 and 10
      ...Array.from({ length: 10 }, () => [
        Math.floor(Math.random() * 20) - 10,
        Math.floor(Math.random() * 20) - 10,
      ]),
    ],
  };
  return (
    <Container>
      {isLoading && <GlobalLoadingOverlay message="Setting up your workspace..." />}
      <div className="min-h-[60rem] flex justify-center items-start">
        <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
          <GridPattern
            width={120}
            height={120}
            x="50%"
            className="absolute inset-x-0 inset-y-[-30%] h-[160%]  w-full skew-y-[-5deg]  stroke-gray-100  fill-primary stroke-gray-100"
            {...pattern}
          />
        </div>

        {/* Mobile message */}
        {/* <div className="lg:hidden flex flex-col items-center justify-center px-6 mt-40">
          <Logo textClassName="items-center justify-center text-zinc-700" />
          <p className="text-center text-2xl mt-6 text-gray-600">
            We are working hard to make this application mobile friendly. Until then, please use a desktop or laptop to get started.
          </p>
        </div> */}

        {/* Desktop/tablet view */}
        <div className="px-10 py-20 rounded-xl bg-white shadow-lg w-[30rem] mt-40 lg:mt-40 mx-4 relative z-10">
          <div className="flex flex-col items-center justify-center">
            <Logo textClassName="items-center justify-center text-zinc-700" />
          </div>
          <h1 className="my-8 text-xl text-zinc-700 text-center">
            Shopify Integration Successful!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            You have successfully integrated Shopify with your account. Click below to start building and deploying your AI Agents.
          </p>
          <Link href="https://chat.purpleberryai.com/dataintegrations" target="_blank" rel="noopener noreferrer">
            <Button
              type="button"
              variant="large"
              className="rounded-2xl py-2 w-full"
            >
              Redirect Now
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default SignIn;


// import { Suspense } from 'react';
// import Login from './login';

// export default function Page() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Login />
//     </Suspense>
//   );
// }

 {/* {socialButtons.map((button, index) => (
              <button
                type="button"
                onClick={button.onClick}
                className="flex flex-row space-x-2 w-full mx-auto bg-gray-50 justify-center items-center py-4 my-2 rounded-2xl hover:bg-gray-100"
                key={`social-${index}`}
              >
                {button.icon}
                <span>Sign in with {button.name}</span>
              </button>
            ))} */}