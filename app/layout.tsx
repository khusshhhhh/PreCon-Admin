import './globals.css';
import type { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'PreCon Admin',
  description: 'Pre-construction administration workflow manager'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="topbar">
          <h1>PreCon Admin</h1>
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
