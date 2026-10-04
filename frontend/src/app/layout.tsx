import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '../context/AppProviders';
import { TopTicker } from '../components/layout/TopTicker';
import { Navbar } from '../components/layout/Navbar';
import { CartDrawer } from '../components/layout/CartDrawer';
import { CompareTray } from '../components/books/CompareTray';
import { CustomCursor } from '../components/common/CustomCursor';
import { Footer } from '../components/layout/Footer';
import { AIChatbot } from '../components/common/AIChatbot';

export const metadata: Metadata = {
  title: 'BOOKLY — Curated Online Bookstore & Independent Press',
  description: 'Books that mean something. Curated editions, foundational engineering craft, and timeless literature with character.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='min-h-screen flex flex-col antialiased bg-[var(--bg-page)] text-[var(--text-main)] selection:bg-[#fed053] selection:text-black'>
        <AppProviders>
          <CustomCursor />
          <TopTicker />
          <Navbar />
          <CartDrawer />
          <CompareTray />
          <div className='flex-1'>{children}</div>
          <Footer />
          <AIChatbot />
        </AppProviders>
      </body>
    </html>
  );
}
