import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
import { getAuthenticatedUser } from '@/lib/authUtils';

// Handles GET /api/data/rooms
export async function GET() {
  await connectDB();
  const rooms = await Room.find();
  return NextResponse.json(rooms);
}

// Handles POST /api/data/rooms
export async function POST(request: Request) {
  await connectDB();
  const user = await getAuthenticatedUser();
  if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const newRoom = await Room.create(body);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}