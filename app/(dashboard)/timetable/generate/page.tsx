'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTimetable } from '@/context/TimetableContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiCpu, FiCheckCircle } from 'react-icons/fi';

export default function GenerateTimetablePage() {
  const router = useRouter();
  const { token } = useAuth();
  const { setLatestTimetable } = useTimetable(); // Get the global state setter

  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');

  const handleGeneration = async () => {
    setIsLoading(true);
    setIsComplete(false);
    setError('');

    try {
      if (!token) throw new Error("Authentication error. Please log in again.");

      const res = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ program: "FYUP Computer Science", semester: "Fall 2025" }),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Generation failed.');
        }
        // Save the entire timetable object to our global state
        setLatestTimetable(data.timetable);
        setIsComplete(true);
      } else {
        const textError = await res.text();
        console.error("Backend returned a non-JSON response:", textError);
        throw new Error("The server returned an unexpected error. Check the console for details.");
      }
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const viewGeneratedTimetable = () => {
    // Navigate directly to the view page. It will get the data from the global state.
    router.push('/timetable/view');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Generate New Timetable</h1>
      
      <GlassCard className="p-8">
        {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-center mb-4">{error}</p>}

        {!isLoading && !isComplete && (
          <div className="text-center">
            <FiUploadCloud size={60} className="mx-auto text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Ready to Build Your Schedule</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Ensure all Courses, Faculty, and Rooms are added correctly before starting the generation process.
            </p>
            <Button onClick={handleGeneration} className="bg-blue-600 hover:bg-blue-700 shadow-lg text-lg px-8 py-3">
              <FiCpu className="inline-block mr-2" />
              Start Generation
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-t-blue-500 border-gray-600 rounded-full mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold">AI is at Work...</h2>
            <p className="text-gray-400">This may take a moment. Please don&apos;t close the page.</p>
          </div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <FiCheckCircle size={60} className="mx-auto text-green-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Timetable Generated Successfully!</h2>
            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={viewGeneratedTimetable} className="bg-blue-600 hover:bg-blue-700">View Timetable</Button>
              <Button onClick={() => setIsComplete(false)} className="bg-transparent border border-white/20 hover:bg-white/10">Start Over</Button>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}