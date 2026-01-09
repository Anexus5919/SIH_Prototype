// app/page.tsx
'use client'; // Required for Framer Motion components

import Link from 'next/link';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { FiCpu, FiUsers, FiZap } from 'react-icons/fi';

const features = [
  {
    icon: <FiCpu size={28} className="text-cyan-400" />,
    title: 'AI-Powered Core',
    description: 'Leverages advanced algorithms to solve complex scheduling conflicts in seconds.',
  },
  {
    icon: <FiZap size={28} className="text-purple-400" />,
    title: 'Conflict-Free',
    description: 'Guarantees zero clashes for faculty, students, and resources automatically.',
  },
  {
    icon: <FiUsers size={28} className="text-pink-400" />,
    title: 'NEP 2020 Aligned',
    description: 'Built for the modern multidisciplinary, credit-based education structure.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white relative">
      {/* Animated Gradient Background - REMOVED to show DotGrid */
        /* <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-gray-900 via-blue-900/40 to-gray-900" /> */
      }

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 md:p-12 text-center">
          <Link href="/">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              EduSchedule AI
            </h1>
          </Link>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            Intelligent Timetabling for the Modern University. Effortless, Optimized, and Future-Ready.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-blue-500/50 shadow-lg">
                Launch App
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-transparent border-2 border-blue-500 hover:bg-blue-500">
                Sign Up
              </Button>
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why EduSchedule AI?</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <GlassCard key={index} className="p-6 text-center flex flex-col items-center">
              <div className="mb-4 p-4 bg-white/10 rounded-full">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}