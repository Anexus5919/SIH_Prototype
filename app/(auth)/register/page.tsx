'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';

type Role = 'Student' | 'Faculty' | 'Admin';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // --- ❗ CORRECTED URL: Use a relative path to your Next.js API route ❗ ---
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      // --------------------------------------------------------------------

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to register');

      alert('Registration successful! Please log in.');
      router.push('/login');

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900/40 to-gray-900">
      <GlassCard className="p-8 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center text-white mb-2">
              Create an Account
            </motion.h2>

            {error && (
              <motion.p variants={itemVariants} className="bg-red-500/30 text-red-400 text-center p-3 rounded-lg">
                {error}
              </motion.p>
            )}
            
            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full mt-1 p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" required className="w-full mt-1 p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400">Password</label>
              <PasswordInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <PasswordStrengthMeter password={password} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400 mb-2 block">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Student', 'Faculty', 'Admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-3 rounded-lg text-sm transition-all duration-300 ${
                      role === r ? 'bg-blue-600 text-white font-semibold' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-500/50 shadow-lg py-3 mt-2" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-400 hover:underline">
                Log In
              </Link>
            </motion.p>
          </motion.div>
        </form>
      </GlassCard>
    </div>
  );
}