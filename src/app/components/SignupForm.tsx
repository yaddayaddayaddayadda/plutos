"use client";

import { useState } from 'react';
import styles from './SignupForm.module.css';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Reset the error messages before validations
    setError("");

    if (!email) {
      setError("Please enter an email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    // If all validations pass, perform the fetch request
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          const errorData = await response.json();
        setError(`Signup failed: ${errorData.message || response.statusText}`);
        return;
      }
      // Sign up successful
      alert("Sign up successful");

    } catch (error) {
        console.error("Error during signup: ", error);
        setError("An unexpected error occurred");
    }
  };


  return (
    <div className={styles.signupFormContainer}>
        <h2>Create an Account</h2>
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.signupButton}>Sign Up</button>
      </form>
    </div>
  );
}