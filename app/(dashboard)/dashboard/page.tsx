'use client';

import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FiUsers, FiBookOpen, FiClipboard, FiZap, FiCalendar, FiUser } from 'react-icons/fi';

// --- Admin Dashboard Component ---
const AdminDashboard = () => {
  const stats = [
    { name: 'Total Faculty', value: '75', icon: FiUsers },
    { name: 'Total Courses', value: '120', icon: FiBookOpen },
    { name: 'Classrooms', value: '30', icon: FiClipboard },
    { name: 'Constraints Met', value: '99.8%', icon: FiZap },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <GlassCard key={stat.name} className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full"><stat.icon className="text-blue-400" size={24} /></div>
            <div><p className="text-gray-400 text-sm">{stat.name}</p><p className="text-2xl font-bold">{stat.value}</p></div>
          </GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Timetable Management</h2>
          <p className="text-gray-400 mb-6">Generate a new timetable or view and edit existing schedules.</p>
          <div className="flex gap-4">
            <Link href="/timetable/generate"><Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">Generate New Timetable</Button></Link>
            <Link href="/timetable/view"><Button className="bg-white/10 hover:bg-white/20">View Schedules</Button></Link>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/manage/faculty" className="text-left w-full p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Manage Faculty</Link>
            <Link href="/manage/courses" className="text-left w-full p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Manage Courses</Link>
            <Link href="/manage/rooms" className="text-left w-full p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Manage Rooms</Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// --- Faculty Dashboard Component ---
const FacultyDashboard = () => (
  <div>
    <h1 className="text-4xl font-bold mb-8">Faculty Dashboard</h1>
    <GlassCard className="p-8 text-center">
      <FiCalendar size={48} className="mx-auto text-blue-400 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">View Your Schedule</h2>
      <p className="text-gray-400 mb-6">Access your personal weekly timetable and set your availability preferences.</p>
      <Link href="/timetable/view"><Button className="bg-blue-600 hover:bg-blue-700">View My Timetable</Button></Link>
    </GlassCard>
  </div>
);

// --- Student Dashboard Component ---
const StudentDashboard = () => (
  <div>
    <h1 className="text-4xl font-bold mb-8">Student Dashboard</h1>
    <GlassCard className="p-8 text-center">
      <FiUser size={48} className="mx-auto text-blue-400 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Welcome!</h2>
      <p className="text-gray-400 mb-6">Here you can view your personalized timetable for the semester.</p>
      <Link href="/timetable/view"><Button className="bg-blue-600 hover:bg-blue-700">View My Timetable</Button></Link>
    </GlassCard>
  </div>
);


// --- Main Page Component ---
export default function DashboardPage() {
  const { user } = useAuth();

  // Render the correct dashboard based on the user's role
  switch (user?.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Faculty':
      return <FacultyDashboard />;
    case 'Student':
      return <StudentDashboard />;
    default:
      // You can add a loading spinner or a default view here
      return <div>Loading...</div>;
  }
}