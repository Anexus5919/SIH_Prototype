// client/app/layout.tsx
import '../styles/globals.css';
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
      <body className={`${inter.className} bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider>
          <TimetableProvider>
              {children}
            </TimetableProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}