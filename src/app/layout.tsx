import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import "./globals.css";
import { Inter, Open_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontHeadline = Inter({
  subsets: ['latin'],
  variable: '--font-headline',
});

const fontBody = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata = {
  title: 'BFF — Books For Foster',
  description: 'Empowering students with free book rentals through a community-driven donation platform by PixelKliq.',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontHeadline.variable, fontBody.variable)}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
