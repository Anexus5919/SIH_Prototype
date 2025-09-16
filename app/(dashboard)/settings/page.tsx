// client/app/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiBell, FiServer, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../../context/ThemeContext';
import { PasswordInput } from '../../../components/ui/PasswordInput';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth(); // Get user data from context

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    // **VALIDATION LOGIC**
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    // API call to update password would go here
    setShowSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile & Preferences Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <FiUser size={24} className="text-blue-400" />
              <h2 className="text-2xl font-semibold">Profile</h2>
            </div>
            {/* **POPULATED PROFILE DATA** */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="font-semibold text-lg">{user?.name || 'Loading...'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
                <p className="font-semibold text-lg">{user?.email || 'Loading...'}</p>
              </div>
               <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
                <p className="font-semibold text-lg capitalize">{user?.role || 'Loading...'}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-6"> <FiBell size={24} className="text-blue-400" /> <h2 className="text-2xl font-semibold">Preferences</h2> </div>
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold">Dark Mode</h3><p className="text-sm text-gray-500 dark:text-gray-400">Toggle the theme.</p></div>
              <div onClick={toggleTheme} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <motion.div layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} className={`w-6 h-6 bg-white rounded-full shadow-md ${theme === 'light' ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Security & Advanced Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-6"> <FiLock size={24} className="text-blue-400" /> <h2 className="text-2xl font-semibold">Change Password</h2> </div>
            {passwordError && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center mb-4">{passwordError}</p>}
            <form className="space-y-4" onSubmit={handlePasswordSave}>
              <div> <label className="text-sm text-gray-500 dark:text-gray-400">Current Password</label> <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /> </div>
              <div> <label className="text-sm text-gray-500 dark:text-gray-400">New Password</label> <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /> </div>
              <div> <label className="text-sm text-gray-500 dark:text-gray-400">Confirm New Password</label> <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /> </div>
              <div className="flex items-center gap-4 pt-2"> <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Password</Button> <AnimatePresence>{showSuccess && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-green-400 text-sm">Password updated!</motion.p>)}</AnimatePresence> </div>
            </form>
          </GlassCard>
          
          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-6"> <FiServer size={24} className="text-blue-400" /> <h2 className="text-2xl font-semibold">Session Management</h2> </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">For security, you can log out of all other active sessions on your account.</p>
            <Button className="bg-red-600/20 text-red-400 hover:bg-red-600/40 border border-red-500/50"> <FiLogOut className="inline-block mr-2"/> Log Out Everywhere </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}