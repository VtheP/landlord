// components/SignIn.tsx
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

export default function SignIn() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Sign In with Google
    </button>
  );
}