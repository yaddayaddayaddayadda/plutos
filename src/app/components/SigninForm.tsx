"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SigninForm.module.css';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter an email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        let errorData;
        try {
           errorData = await response.json();
        } catch(jsonError) {
           console.log(jsonError);
           setError(`Sign in failed: ${response.statusText}`);
           return;
        }
         setError(`Sign in failed: ${errorData.message || response.statusText}`);
         return;
      }
      router.push("/profile");

    } catch (error) {
        console.error("Error during sign in: ", error);
        setError("An unexpected error occurred");
    }
  };


  return (
    <div className={styles.signinFormContainer}>
        <h2>Sign in to Plutos</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.signinButton}>Sign In</button>
      </form>
    </div>
  );
}