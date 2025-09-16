import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// This helper function can be defined here or in a shared utils file
// const generateToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET as string, {
//     expiresIn: '30d',
//   });
// };

// This function handles POST requests made to /api/auth/register
export async function POST(request: Request) {
  await connectDB();
  
  try {
    const { name, email, password, role } = await request.json(); // Replaces req.body

    let user = await User.findOne({ email });
    if (user) {
      // Replaces res.status(400).json(...)
      return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
    }

    user = new User({ name, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // The user does not get a token on register, they must log in.
    return NextResponse.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, { status: 201 });

  } catch (err: unknown) {
    console.error(err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}