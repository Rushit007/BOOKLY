import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '../context/AppProviders';
import { Navbar } from '../components/layout/Navbar';
import { CartDrawer } from '../components/layout/CartDrawer';
import { CompareTray } from '../components/books/CompareTray';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'BOOKLY - Modern Online Bookstore & E-Commerce Platform',
  description: 'A cutting-edge online bookstore curated for developers, thinkers, and avid readers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='min-h-screen flex flex-col antialiased'>
        <AppProviders>
          <Navbar />
          <CartDrawer />
          <CompareTray />
          <div className='flex-1'>{children}</div>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
