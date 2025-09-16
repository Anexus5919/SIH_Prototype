import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Timetable from '@/lib/models/Timetable';

type Params = { params: { id: string } };

// This function handles GET requests to /api/timetables/[id]
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const timetable = await Timetable.findById(params.id)
      .populate('schedule.course', 'courseCode title')
      .populate('schedule.faculty', 'name')
      .populate('schedule.room', 'roomNumber');
      
    if (!timetable) {
      return NextResponse.json({ message: 'Timetable not found' }, { status: 404 });
    }
    
    return NextResponse.json(timetable);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}