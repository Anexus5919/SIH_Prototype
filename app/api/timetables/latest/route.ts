import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Timetable from '@/lib/models/Timetable';
// These explicit imports are a best practice for Vercel's serverless environment
import Course from '@/lib/models/Course';
import Faculty from '@/lib/models/Faculty';
import Room from '@/lib/models/Room';

// This function handles GET requests to /api/timetables/latest
export async function GET() {
  await connectDB();
  try {
    const latestTimetable = await Timetable.findOne()
      .sort({ createdAt: -1 }) // Efficiently finds the newest document
      .populate([ // This is a robust way to populate nested data
        {
          path: 'schedule.course',
          model: Course,
          select: 'courseCode title' // Only fetch the data you need
        },
        {
          path: 'schedule.faculty',
          model: Faculty,
          select: 'name'
        },
        {
          path: 'schedule.room',
          model: Room,
          select: 'roomNumber'
        }
      ]);
      
    if (!latestTimetable) {
      return NextResponse.json({ message: 'No timetables found' }, { status: 404 });
    }
    
    return NextResponse.json(latestTimetable);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}