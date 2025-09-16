import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { getAuthenticatedUser } from '@/lib/authUtils';

// This function handles GET requests to /api/users
export async function GET() {
  await connectDB();
  
  // Protect the route: only admins can get the user list
  const user = await getAuthenticatedUser();
  if (user?.role !== 'Admin') {
    return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    // Find all users and exclude their password field from the response
    const users = await User.find({}).select('-password');
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}