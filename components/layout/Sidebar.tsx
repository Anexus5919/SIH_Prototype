'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiHome, FiCalendar, FiCpu, FiSettings, FiSliders, FiUsers, FiBookOpen, FiClipboard } from 'react-icons/fi';

// Links visible to all roles
const baseNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'View Timetable', href: '/timetable/view', icon: FiCalendar },
];

// Links visible only to Admins
const adminNavItems = [
    { name: 'Generate', href: '/timetable/generate', icon: FiCpu },
    { name: 'Manage Faculty', href: '/manage/faculty', icon: FiUsers },
    { name: 'Manage Courses', href: '/manage/courses', icon: FiBookOpen },
    { name: 'Manage Rooms', href: '/manage/rooms', icon: FiClipboard },
]

const settingsNavItems = [
    { name: 'General Settings', href: '/settings', icon: FiSettings },
    { name: 'Global Constraints', href: '/settings/constraints', icon: FiSliders },
]

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth(); // Get the current user

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <Link href="/dashboard">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors">
          EduSchedule AI
        </div>
      </Link>
      <nav className="flex-1 p-4 space-y-2">
        {/* Base Navigation */}
        {baseNavItems.map((item) => (
          <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${ pathname.startsWith(item.href) ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }`}>
            <item.icon size={20} /><span>{item.name}</span>
          </Link>
        ))}

        {/* Admin-Only Navigation */}
        {user?.role === 'Admin' && (
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Tools</h3>
                <div className="mt-2 space-y-2">
                    {adminNavItems.map((item) => (
                         <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${ pathname.startsWith(item.href) ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }`}>
                           <item.icon size={20} /><span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        )}
        
        {/* Settings Navigation (Admin Only) */}
        {user?.role === 'Admin' && (
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</h3>
                <div className="mt-2 space-y-2">
                    {settingsNavItems.map((item) => (
                        <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${ pathname.startsWith(item.href) ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }`}>
                           <item.icon size={20} /><span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </nav>
    </aside>
  );
};