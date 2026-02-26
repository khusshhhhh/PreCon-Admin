'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const current = localStorage.getItem('theme') === 'dark';
    setDark(current);
    document.documentElement.classList.toggle('dark', current);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }

  return <button onClick={toggle}>{dark ? '☀️ Light' : '🌙 Dark'}</button>;
}
