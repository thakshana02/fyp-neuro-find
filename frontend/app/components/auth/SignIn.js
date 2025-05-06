'use client';

import { useState } from 'react';
import { signIn, signInWithGoogle } from '../../firebase/auth';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/dashboard'); // Redirect after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/dashboard'); // Redirect after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        
        {error && <div className="p-4 text-red-500">{error}</div>}
        
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}