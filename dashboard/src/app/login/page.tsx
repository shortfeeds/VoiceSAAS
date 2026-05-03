'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        router.push('/dashboard');
      } else {
        alert('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error', err);
      alert('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="grid-bg" />
      <div className="hero-glow" />
      
      <div className={`${styles.card} glass animate-fade`}>
        <div className={styles.logo}>TRINITY PIXELS</div>
        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to manage your AI Receptionist</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className={styles.footer}>
          Don't have an account? <Link href="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
