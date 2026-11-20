import '@/styles/shell.css';
import '@/styles/pages.css';
import Icons from '@/components/Icons';
import Minibar from '@/components/Minibar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import MobileMenu from '@/components/MobileMenu';
import Toast from '@/components/Toast';
import { StoreProvider } from '@/context/StoreContext';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'ANGADI — trail & outdoor running apparel',
  description: 'ANGADI makes trail-running and outdoor layers: breathable shells, fleeces and vests that move with you from first light to the last climb. Shop new arrivals and the lookbook.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    type: 'website',
    title: 'ANGADI — built for the long way out',
    description: 'Trail-running and outdoor layers that move with you from first light to the last climb.',
    images: ['/photos/158-solum/group.jpg']
  }
};

export const viewport = {
  themeColor: '#ECE6DC'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..800&family=Geist:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Icons />
        <StoreProvider>
          {children}
          <Minibar />
          <Footer />
          <CartDrawer />
          <MobileMenu />
          <Toast />
          <div className="grain" aria-hidden="true"></div>
        </StoreProvider>
      </body>
    </html>
  );
}
