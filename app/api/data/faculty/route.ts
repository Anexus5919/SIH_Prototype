import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Faculty from '@/lib/models/Faculty';
import { getAuthenticatedUser } from '@/lib/authUtils';

// Handles GET /api/data/faculty
export async function GET() {
  await connectDB();
  const faculty = await Faculty.find().populate('user', 'name email');
  return NextResponse.json(faculty);
}

// Handles POST /api/data/faculty
export async function POST(request: Request) {
  await connectDB();
  const user = await getAuthenticatedUser();
  if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const newFaculty = await Faculty.create(body);
    return NextResponse.json(newFaculty, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
  }
}