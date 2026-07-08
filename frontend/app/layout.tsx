import './globals.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RouteGuard from '@/router/RouteGuard';

import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
} from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
});

export const metadata = {
  title: 'MINIMAL',
  description: 'A dialogue between architecture and anatomy. Exploring the boundaries of movement through tailored silhouettes and premium fibers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${plusJakartaSans.variable} ${cormorantGaramond.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-off-white font-display text-soft-charcoal selection:bg-brand-teal selection:text-white">
        <RouteGuard>
          <Header />
          {children}
          <Footer />
        </RouteGuard>
      </body>
    </html>
  );
}