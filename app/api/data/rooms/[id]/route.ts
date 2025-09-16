import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
import { getAuthenticatedUser } from '@/lib/authUtils';

type Params = { params: { id: string } };

// Handles GET /api/data/rooms/[id]
export async function GET(request: Request, { params }: Params) {
    await connectDB();
    const room = await Room.findById(params.id);
    if (!room) return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    return NextResponse.json(room);
}

// Handles PUT /api/data/rooms/[id]
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const body = await request.json();
        const updatedRoom = await Room.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedRoom) return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        return NextResponse.json(updatedRoom);
    } catch (err: unknown) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 400 });
    }
}

// Handles DELETE /api/data/rooms/[id]
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const deletedRoom = await Room.findByIdAndDelete(params.id);
    if (!deletedRoom) return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    return NextResponse.json({ message: 'Room deleted successfully' });
}