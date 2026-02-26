'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SiteCreateForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/sites', { method: 'POST', body: fd });
    if (!res.ok) {
      setError('Failed to create site');
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form className="grid two" onSubmit={submit}>
      <input name="name" required placeholder="Site name" />
      <input name="address" required placeholder="Address" />
      <input name="council" required placeholder="Council" />
      <input name="area" required placeholder="Area (e.g. 760sqm)" />
      <input name="currentSituation" required placeholder="Current situation" />
      <input name="proposedDevelopment" required placeholder="Proposed development" />
      <input name="numberOfHouses" type="number" min={1} defaultValue={1} required placeholder="No. Houses" />
      <input name="numberOfStoreys" type="number" min={1} defaultValue={1} required placeholder="No. Storeys" />
      <div className="row" style={{ gridColumn: '1/-1' }}>
        <button className="primary" type="submit">Create site</button>
        {error && <small style={{ color: 'tomato' }}>{error}</small>}
      </div>
    </form>
  );
}
