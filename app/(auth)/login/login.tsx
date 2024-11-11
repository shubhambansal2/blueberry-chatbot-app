// 'use client'
// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
// import { login } from '../../lib/login';
// import GoogleLoginComponent from '../../components/google_login';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [keepSignedIn, setKeepSignedIn] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const fromsignup = searchParams.get('fromsignup');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   // ... other functions

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const success = await login(email, password);
//     if (success) {
//       router.push('/');
//     } else {
//       setError('Invalid email or password');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="mb-6 text-2xl text-black font-semibold">
//         <span className="text-blue-500 text-4xl">○</span> Blueberry AI
//       </div>
//       <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <h1 className="mb-6 text-2xl font-bold text-center text-blue-900">
//         {fromsignup === '1' ? 'You have successfully signed up. Login to get started!' : 'Welcome'}
//       </h1>
//         <div className="mb-4">
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             type="text"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-6 relative">
//        <input
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//         type={showPassword ? "text" : "password"}
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button 
//         type="button" 
//         className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
//         onClick={togglePasswordVisibility}
//       >
//         {showPassword ? (
//           <svg className="h-6 w-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
//             <path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"/>
//           </svg>
//         ) : (
//           <svg className="h-6 w-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
//             <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/>
//           </svg>
//         )}
//       </button>
//     </div>
//         <div className="flex items-center justify-between mb-6">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               className="mr-2 leading-tight"
//               checked={keepSignedIn}
//               onChange={(e) => setKeepSignedIn(e.target.checked)}
//             />
//             <span className="text-sm text-black">Keep me signed in</span>
//           </label>
//           <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
//             Forgot password?
//           </a>
//         </div>
//         {error && (
//             <div className="text-red-500 text-sm text-center">
//               {error}
//             </div>
//           )}
//         <div className="flex flex-col items-center justify-between">
          
//           <button className="w-full bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
//           <div className="text-black">
//           <p> OR </p>
//           </div>
//           <GoogleLoginComponent/>
//         </div>
//         <p className="text-center text-black  mt-6">
//           No account yet? <a className="font-bold text-blue-500 hover:text-blue-800" href="/signup">Sign up</a>
//         </p>
//       </form>
//     </div>
//   );
// }