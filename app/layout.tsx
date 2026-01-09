// client/app/layout.tsx
import '../styles/globals.css';
import DotGrid from '../components/DotGrid';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { TimetableProvider } from '../context/TimetableContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduSchedule AI',
  description: 'AI-Powered Timetable Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0a0a0a] text-gray-800 dark:text-gray-200 transition-colors duration-300 relative overflow-hidden`}>
        <DotGrid dotSize={4} gap={24} baseColor="rgba(255, 255, 255, 0.3)" activeColor="rgba(255, 255, 255, 0.7)" />
        <div className="relative z-10 h-full overflow-y-auto">
          <AuthProvider>
            <ThemeProvider>
              <TimetableProvider>
                {children}
              </TimetableProvider>
            </ThemeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}