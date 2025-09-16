import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/lib/models/Course';
import { getAuthenticatedUser } from '@/lib/authUtils';

type Params = { params: { id: string } };

// Handles GET /api/data/courses/[id]
export async function GET(request: Request, { params }: Params) {
  await connectDB();
  try {
    const course = await Course.findById(params.id);
    if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    return NextResponse.json(course);
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

// Handles PUT /api/data/courses/[id]
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const body = await request.json();
        const course = await Course.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        return NextResponse.json(course);
    } catch (err: unknown) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
    }
}

// Handles DELETE /api/data/courses/[id]
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const course = await Course.findByIdAndDelete(params.id);
        if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });
        return NextResponse.json({ message: 'Course removed successfully' });
    } catch {
        return NextResponse.json({ error: 'Server error.' }, { status: 500 });
    }
}