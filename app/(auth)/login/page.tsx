'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', { method: 'POST', body: fd });
    if (!res.ok) {
      setError('Invalid credentials');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Login</h2>
        <p className="muted">Use seeded login: owner@preconadmin.app / Password@123</p>
        <form onSubmit={onSubmit} className="grid">
          <input name="email" type="email" required placeholder="Email" />
          <input name="password" type="password" required placeholder="Password" />
          {error && <small style={{ color: 'tomato' }}>{error}</small>}
          <button className="primary" type="submit">Login</button>
        </form>
        <p><small>No account? <Link href="/signup">Sign up</Link></small></p>
      </div>
    </main>
  );
}
