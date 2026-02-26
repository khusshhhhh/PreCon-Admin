'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/signup', { method: 'POST', body: fd });
    if (!res.ok) {
      setError('Could not create account');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Create Account</h2>
        <form onSubmit={onSubmit} className="grid">
          <input name="name" required placeholder="Name" />
          <input name="email" type="email" required placeholder="Email" />
          <input name="password" type="password" required minLength={8} placeholder="Password" />
          {error && <small style={{ color: 'tomato' }}>{error}</small>}
          <button className="primary" type="submit">Sign up</button>
        </form>
        <p><small>Already registered? <Link href="/login">Login</Link></small></p>
      </div>
    </main>
  );
}
