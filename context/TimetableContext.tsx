'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface TimetableData {
  _id: string;
  program: string;
  semester: string;
  schedule: Array<{
    _id: string;
    day: string;
    time: string;
    status?: 'Scheduled' | 'Cancelled';
    comment?: string;
    course: { _id: string; courseCode: string; title: string };
    faculty: { _id: string; name: string };
    room: { _id: string; roomNumber: string };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TimetableContextType {
  latestTimetable: TimetableData | null;
  setLatestTimetable: (timetable: TimetableData | null) => void;
  isLoading: boolean;
}

const TimetableContext = createContext<TimetableContextType | null>(null);

export const TimetableProvider = ({ children }: { children: React.ReactNode }) => {
  const [latestTimetable, setLatestTimetable] = useState<TimetableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTimetable = async () => {
      console.log('Fetching timetable data...');
      
      try {
        // --- ❗ THIS URL IS NOW RELATIVE ❗ ---
        // Since timetables/latest doesn't require auth, we can fetch without token
        const res = await fetch('/api/timetables/latest', {
          headers: { 'Content-Type': 'application/json' }
        });
        // ------------------------------------

        if (res.ok) {
          const data = await res.json();
          setLatestTimetable(data);
        } else if (res.status === 404) {
          setLatestTimetable(null);
        } else {
          console.error("Failed to fetch latest timetable:", res.status, res.statusText);
          const errorData = await res.text();
          console.error("Error response:", errorData);
        }
      } catch (error) {
        console.error("Network error while fetching timetable:", error);
        // Set a default state instead of leaving it undefined
        setLatestTimetable(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestTimetable();
  }, []);
  
  return (
    <TimetableContext.Provider value={{ latestTimetable, setLatestTimetable, isLoading }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};