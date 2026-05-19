import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Integrity Check Prototype',
  description: 'Prototype for similarity and AI-writing checking.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
