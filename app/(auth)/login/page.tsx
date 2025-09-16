'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PasswordInput } from '@/components/ui/PasswordInput';

// Define the available roles
type Role = 'Student' | 'Faculty' | 'Admin';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Student'); // 1. State for the selected role
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // 2. Pass the role to the login function
    const result = await login(email, password, role); 

    if (!result.success) {
      setError(result.message);
    }
    setIsLoading(false);
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
            className="flex flex-col gap-6"
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center text-white mb-2">
              Welcome Back
            </motion.h2>

            {error && (
              <motion.p variants={itemVariants} className="bg-red-500/30 text-red-400 text-center p-3 rounded-lg">
                {error}
              </motion.p>
            )}

            {/* --- 3. NEW ROLE DROPDOWN UI --- */}
            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400">Login as</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value as Role)} 
                className="w-full mt-1 p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option className='text-stone-950' value="Student">Student</option>
                <option className='text-stone-950' value="Faculty">Faculty</option>
                <option className='text-stone-950' value="Admin">Admin</option>
              </select>
            </motion.div>
            {/* ----------------------------- */}

            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com" 
                required
                className="w-full mt-1 p-3 bg-white/5 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-sm text-gray-400">Password</label>
              <PasswordInput 
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 shadow-blue-500/50 shadow-lg py-3" disabled={isLoading}>
                {isLoading ? 'Logging In...' : 'Log In'}
              </Button>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-blue-400 hover:underline">
                Sign Up
              </Link>
            </motion.p>
          </motion.div>
        </form>
      </GlassCard>
    </div>
  );
}