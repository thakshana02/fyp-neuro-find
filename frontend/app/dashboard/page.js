'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { setAuthCookie } from '../utils/authCookie';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        
        // Get additional user data from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // User is not logged in, redirect to login
        router.push('/login');
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Clear the auth cookie when signing out
      setAuthCookie(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Your App Name</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome to your Dashboard</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                You're now signed in to your account
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {userData?.fullName || 'Not provided'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{user.email}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last login</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    {userData?.lastLogin 
                      ? (userData.lastLogin.toDate 
                          ? new Date(userData.lastLogin.toDate()).toLocaleString()
                          : new Date(userData.lastLogin).toLocaleString())
                      : 'Unknown'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}