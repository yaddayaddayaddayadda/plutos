"use client";

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const navigateToSignupPage = () => {
    router.push('signup');
  }

  const navigateToSigninPage = () => {
    router.push('signin');
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          router.push('/profile');
        } else {
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    }
    checkLoginStatus();
  })

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/plutos-logo.png"
            alt="plutos Logo"
            width={100}
            height={50}
          />
        </div>
        <div className={styles.authButtons}>
          <button onClick = {navigateToSignupPage} className={styles.signupButton}>Sign up</button>
          <button onClick = {navigateToSigninPage} className={styles.loginButton}>Sign in</button>
        </div>
      </header>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Welcome to Plutos</h1>
          <p>Experience the future of trading with our blazing-fast platform.</p>
        </div>
         <Image
          src="/plutos-background.jpg" 
          alt="Trading Background"
          layout="fill"
          objectFit="cover"
          className={styles.backgroundImage}
         />
      </div>
    </main>
  );
}