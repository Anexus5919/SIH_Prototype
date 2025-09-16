// client/app/(dashboard)/settings/constraints/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { GlassCard } from '../../../../components/ui/GlassCard';
import { Button } from '../../../../components/ui/Button';
import { FiSave } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConstraintsPage() {
  const { token } = useAuth();
  const [constraints, setConstraints] = useState({
    breakStartTime: '13:00',
    breakEndTime: '14:00',
    maxHoursPerDay: 2,
    maxConsecutiveClasses: 3,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchConstraints = async () => {
      const res = await fetch('http://localhost:5001/api/constraints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setConstraints(data);
    };
    if (token) fetchConstraints();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConstraints({ ...constraints, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('http://localhost:5001/api/constraints', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(constraints),
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Global Timetable Constraints</h1>
      <GlassCard className="p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mandatory Break Time</label>
            <div className="flex items-center gap-4 mt-1">
              <input type="time" name="breakStartTime" value={constraints.breakStartTime} onChange={handleInputChange} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <span>to</span>
              <input type="time" name="breakEndTime" value={constraints.breakEndTime} onChange={handleInputChange} className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>
          </div>

          <div>
            <label htmlFor="maxHoursPerDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Hours Per Subject Per Day</label>
            <input type="number" id="maxHoursPerDay" name="maxHoursPerDay" value={constraints.maxHoursPerDay} onChange={handleInputChange} min="1" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <p className="text-xs text-gray-500 mt-1">Limits how many times a single course can appear on any given day.</p>
          </div>

          <div>
            <label htmlFor="maxConsecutiveClasses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Consecutive Classes</label>
            <input type="number" id="maxConsecutiveClasses" name="maxConsecutiveClasses" value={constraints.maxConsecutiveClasses} onChange={handleInputChange} min="1" className="w-full mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <p className="text-xs text-gray-500 mt-1">Limits how many classes a faculty/student can have back-to-back without a break.</p>
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <FiSave className="inline-block mr-2" /> Save Constraints
            </Button>
            <AnimatePresence>
              {showSuccess && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-green-400">Settings saved!</motion.p>}
            </AnimatePresence>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}