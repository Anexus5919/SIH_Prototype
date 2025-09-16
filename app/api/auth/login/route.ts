import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// This helper function can be defined here or in a shared utils file
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

// This function handles POST requests made to /api/auth/login
export async function POST(request: Request) {
  await connectDB();
  
  try {
    const { email, password, role } = await request.json(); // Replaces req.body

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });
    }

    if (user.role !== role) {
      return NextResponse.json({ msg: 'Role mismatch. Please select your correct role.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });
    }

    const token = generateToken(user.id);

    // Replaces res.json(...)
    return NextResponse.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });

  } catch (err: unknown) {
    console.error(err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}