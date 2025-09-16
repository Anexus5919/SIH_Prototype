import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Constraint from '@/lib/models/Constraint';
import { getAuthenticatedUser as getAuth } from '@/lib/authUtils';

// This function handles GET requests to /api/constraints
export async function GET() {
  await connectDB();
  try {
    let constraints = await Constraint.findOne({ singleton: 'global_constraints' });
    // If no settings exist, create a default document
    if (!constraints) {
      constraints = await Constraint.create({});
    }
    return NextResponse.json(constraints);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

// This function handles PUT requests to /api/constraints
export async function PUT(request: Request) {
  await connectDB();
  
  // Protect the route: only admins can update constraints
  const user = await getAuth();
  if (user?.role !== 'Admin') {
    return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const constraints = await Constraint.findOneAndUpdate(
      { singleton: 'global_constraints' },
      body,
      { new: true, upsert: true, runValidators: true } // upsert:true creates the doc if it's missing
    );
    return NextResponse.json(constraints);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
  }
}