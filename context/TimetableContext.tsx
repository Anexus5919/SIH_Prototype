'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TimetableContext = createContext<any>(null);

export const TimetableProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [latestTimetable, setLatestTimetable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTimetable = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        // --- ❗ THIS URL IS NOW RELATIVE ❗ ---
        const res = await fetch('/api/timetables/latest', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // ------------------------------------

        if (res.ok) {
          const data = await res.json();
          setLatestTimetable(data);
        } else if (res.status === 404) {
          setLatestTimetable(null);
        } else {
          console.error("Failed to fetch latest timetable:", res.statusText);
        }
      } catch (error) {
        console.error("Network error while fetching timetable:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestTimetable();
  }, [token]);
  
  return (
    <TimetableContext.Provider value={{ latestTimetable, setLatestTimetable, isLoading }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => useContext(TimetableContext);