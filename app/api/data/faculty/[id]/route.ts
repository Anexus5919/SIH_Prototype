import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Faculty from '@/lib/models/Faculty';
import { getAuthenticatedUser } from '@/lib/authUtils';

type Params = { params: { id: string } };

// Handles GET /api/data/faculty/[id]
export async function GET(request: Request, { params }: Params) {
    await connectDB();
    const faculty = await Faculty.findById(params.id).populate('user', 'name email');
    if (!faculty) return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
    return NextResponse.json(faculty);
}

// Handles PUT /api/data/faculty/[id]
export async function PUT(request: Request, { params }: Params) {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    try {
        const body = await request.json();
        const updatedFaculty = await Faculty.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!updatedFaculty) return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
        return NextResponse.json(updatedFaculty);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

// Handles DELETE /api/data/faculty/[id]
export async function DELETE(request: Request, { params }: Params) {
    await connectDB();
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    
    const deletedFaculty = await Faculty.findByIdAndDelete(params.id);
    if (!deletedFaculty) return NextResponse.json({ message: 'Faculty not found' }, { status: 404 });
    return NextResponse.json({ message: 'Faculty removed successfully' });
}