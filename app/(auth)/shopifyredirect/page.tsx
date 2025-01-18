"use client";
import Button from "../../../components/Button";
import { Container } from "../../../components/Container"
import { GridPattern } from "../../../components/GridPattern";
import Logo from "../../../components/Logo";
import { login } from "../../../lib/login";
import GoogleLoginComponent from "../../../components/google_login";
import GlobalLoadingOverlay from "../../../components/GlobalLoadingOverlay";
import { Alert, AlertDescription } from "@components/ui/alert"
import { ArrowRight } from 'lucide-react'

import type { NextPage } from "next";
import Link from "next/link";
import {
  AiOutlineGithub,
  AiOutlineGoogle,
  AiOutlineTwitter,
} from "react-icons/ai";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SignIn: NextPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invalidcredentials, setInvalidcredentials] = useState<boolean>(false);
  const [isFromChatbot, setIsFromChatbot] = useState<boolean>(false);

  useEffect(() => {
    setIsFromChatbot(searchParams.get('from') === 'chatbot');
  }, [searchParams]);
  
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

  const handleShopifyRedirect = () => {
    router.push('https://chat.purpleberryai.com/dataintegrations');
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

        <div className="px-10 py-20 rounded-xl bg-white shadow-lg w-[30rem] mt-40 lg:mt-40 mx-4 relative z-10">
          {isFromChatbot && (
            <Alert className="mb-6">
              <AlertDescription className="flex items-center justify-between">
                <span>If you have been redirected from Chatbot platform, to continue shopify integration</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShopifyRedirect}
                  className="ml-2 flex items-center gap-2"
                >
                  <>
                    Redirect Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col items-center justify-center">
            <Logo textClassName="items-center justify-center text-zinc-700" />
          </div>
          <h1 className="my-8 text-xl text-zinc-700 text-center">
            Signin to Purpleberry AI
          </h1>
          {invalidcredentials && (
            <p className="mt-1 text-sm text-red-500">Invalid email or password, please try again</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                className={`w-full rounded-xl shadow-sm border ${
                  email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    ? 'border-red-500'
                    : 'border-gray-100'
                } placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
              )}
            </div>
            <div className="mb-6">
              <input
                type="password"
                className={`w-full rounded-xl shadow-sm border ${
                  password && password.length < 8
                    ? 'border-red-500'
                    : 'border-gray-100'
                } placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              as="button"
              variant="large"
              className="rounded-2xl py-2 w-full"
              onClick={handleSubmit}
              disabled={!email || !password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8}
            >
              Sign In
            </Button>
          </form>

          <div className="flex flex-row space-x-1 items-center mt-4">
            <div className="h-px w-1/2 bg-gray-200" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px w-1/2 bg-gray-200" />
          </div>

          <div className="mt-4 flex mx-auto justify-center items-center flex-col ">
            <GoogleLoginComponent/>
          </div>
          <Link
            href="/signup"
            className="text-gray-600 block mt-4 text-sm text-center"
          >
            No Account Yet ? <span className="text-bold text-blue-500">Click here to Sign Up</span>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default SignIn;

