import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/lib/models/Course';
import { getAuthenticatedUser } from '@/lib/authUtils';

// Handles GET /api/data/courses
export async function GET() {
  await connectDB();
  
  // --- THIS PART IS UPDATED ---
  // Protect the route: only authenticated users can view courses
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }
  // --------------------------

  try {
    const courses = await Course.find();
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ error: 'Server error while fetching courses.' }, { status: 500 });
  }
}

// Handles POST /api/data/courses (Your implementation was already correct)
export async function POST(request: Request) {
  await connectDB();
  
  // Protect the route: only admins can create courses
  const user = await getAuthenticatedUser();
  if (user?.role !== 'Admin') {
    return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const course = await Course.create(body);
    return NextResponse.json(course, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
  }
}