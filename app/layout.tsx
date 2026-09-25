import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tatulogue | Your tattoo journey starts here',
  description:
    'Tatulogue connects tattoo artists with enthusiasts. Discover artists by style, build your portfolio, and find the right canvas — all in one place.',
  openGraph: {
    title: 'Tatulogue | Your tattoo journey starts here',
    description:
      'Tatulogue connects tattoo artists with enthusiasts. Discover artists by style, build your portfolio, and find the right canvas — all in one place.',
    url: 'https://tatulogue.com',
    siteName: 'Tatulogue',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tatulogue | Your tattoo journey starts here',
    description: 'Discover tattoo artists. Share your vision. The right place. The right artist.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HL4LNZVQ6Y" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HL4LNZVQ6Y');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
