'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // We need the auth token to fetch

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
        const res = await fetch('http://localhost:5001/api/timetables/latest', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setLatestTimetable(data);
        }
      } catch (error) {
        console.error("Failed to fetch latest timetable:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestTimetable();
  }, [token]); // Refetch when the user logs in (token becomes available)
  
  return (
    <TimetableContext.Provider value={{ latestTimetable, setLatestTimetable, isLoading }}>
      {children}
    </TimetableContext.Provider>
  );
};

export const useTimetable = () => useContext(TimetableContext);