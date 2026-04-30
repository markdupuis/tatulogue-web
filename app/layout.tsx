import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tatūlogue | Your tattoo journey starts here',
  description:
    'Tatūlogue connects tattoo artists with enthusiasts. Discover artists by style, build your portfolio, and find the right canvas — all in one place.',
  openGraph: {
    title: 'Tatūlogue | Your tattoo journey starts here',
    description:
      'Tatūlogue connects tattoo artists with enthusiasts. Discover artists by style, build your portfolio, and find the right canvas — all in one place.',
    url: 'https://tatulogue.com',
    siteName: 'Tatūlogue',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tatūlogue | Your tattoo journey starts here',
    description: 'Discover tattoo artists. Share your vision. The right place. The right artist.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
