"use client";

import SignupForm from '../components/SignupForm';
import styles from '../page.module.css';

export default function SignupPage() {
  return (
    <main className={styles.main}>
       <SignupForm />
    </main>
  );
}