import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Timetable from '@/lib/models/Timetable';

type Params = { params: { timetableId: string; slotId: string } };

// This function handles PUT requests to /api/timetables/[timetableId]/slots/[slotId]
export async function PUT(request: Request, { params }: Params) {
  await connectDB();
  try {
    const { timetableId, slotId } = params;
    const { status, comment } = await request.json();

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return NextResponse.json({ message: 'Timetable not found' }, { status: 404 });
    }

    const slot = timetable.schedule.id(slotId);
    if (!slot) {
      return NextResponse.json({ message: 'Class slot not found' }, { status: 404 });
    }
    
    slot.status = status;
    slot.comment = comment;

    await timetable.save();
    
    return NextResponse.json(slot);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}