import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <div className="container">
      <div className="card row" style={{ justifyContent: 'space-between' }}>
        <div>
          <strong>{user.name}</strong> <small className="muted">{user.email}</small>
        </div>
        <div className="row">
          <Link href="/dashboard">Dashboard</Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
