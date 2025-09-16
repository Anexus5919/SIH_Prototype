import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import connectDB from './db';

/**
 * Gets the authenticated user from the request headers.
 * @returns The user object if authenticated, otherwise null.
 */
export const getAuthenticatedUser = async (): Promise<any | null> => {
    await connectDB();
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.split(' ')[1];
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            const user = await User.findById(decoded.id).select('-password');
            if (user) return user;
        } catch (error) {
            // Token failed verification
            return null;
        }
    }
    // No token found
    return null;
};