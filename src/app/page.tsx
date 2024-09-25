// pages/index.tsx (or pages/home.tsx, depending on your routing setup)
'use client';
import { useEffect, useState } from 'react'
import Link from 'next/link'
//import { useAuth } from '../contexts/AuthContext'
import SignIn from '../components/SignIn'
import { User } from 'firebase/auth'
import { auth } from '../../firebase'  // Make sure this import is correct

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Landlord App</h1>
      {user ? (
        <>
          <p className="mb-4">Welcome, {user.displayName}!</p>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-blue-600 hover:underline">
                  Manage Properties
                </Link>
              </li>
              <li>
                <Link href="/rent-dashboard" className="text-blue-600 hover:underline">
                  Rent Dashboard
                </Link>
              </li>
              <li>
                <Link href="/bank-upload" className="text-blue-600 hover:underline">
                  Upload Bank Statement
                </Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={() => auth.signOut()}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <SignIn />
      )}
    </div>
  )
}