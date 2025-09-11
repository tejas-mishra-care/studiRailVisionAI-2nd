
import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { StationProvider } from '@/context/station-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'RailVision AI',
  description: 'Advanced Railway Traffic Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <StationProvider>
          {children}
        </StationProvider>
        <Toaster />
      </body>
    </html>
  );
}
