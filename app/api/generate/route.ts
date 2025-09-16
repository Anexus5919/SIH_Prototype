import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Timetable from '@/lib/models/Timetable';
import Course from '@/lib/models/Course';
import Faculty from '@/lib/models/Faculty';
import Room from '@/lib/models/Room';
import Constraint from '@/lib/models/Constraint';
import TimetableGenerator from '@/lib/ai/generator'; // Assuming you moved the generator
import { getAuthenticatedUser } from '@/lib/authUtils';

// This function handles POST requests to /api/generate
export async function POST(request: Request) {
    await connectDB();

    // Protect the route: only admins can generate timetables
    const user = await getAuthenticatedUser();
    if (user?.role !== 'Admin') {
        return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        // 1. Fetch all necessary data
        const courses = await Course.find();
        const faculty = await Faculty.find();
        const rooms = await Room.find();
        const constraints = await Constraint.findOne({ singleton: 'global_constraints' });

        if (courses.length === 0 || faculty.length === 0 || rooms.length === 0) {
            return NextResponse.json({ message: "Not enough data (courses, faculty, rooms) to generate." }, { status: 400 });
        }

        // 2. Run the AI generator
        console.log("Starting timetable generation...");
        const generator = new TimetableGenerator(courses, faculty, rooms, constraints);
        const bestTimetable = await generator.run();
        console.log("Timetable generation complete.");

        // 3. Save the new timetable
        const { program, semester } = await request.json();
        const newTimetable = new Timetable({
            program,
            semester,
            schedule: bestTimetable.schedule,
        });
        await newTimetable.save();
        
        // 4. Populate the linked fields for the response
        const populatedTimetable = await Timetable.findById(newTimetable._id)
            .populate({ path: 'schedule.course', model: 'Course', select: 'courseCode title' })
            .populate({ path: 'schedule.faculty', model: 'Faculty', select: 'name' })
            .populate({ path: 'schedule.room', model: 'Room', select: 'roomNumber' });

        // 5. Send the complete, populated timetable back to the client
        return NextResponse.json({
            message: "Timetable generated successfully!",
            fitness: bestTimetable.fitness,
            timetableId: populatedTimetable?._id,
            timetable: populatedTimetable,
        }, { status: 201 });

    } catch (err: unknown) {
        console.error("Error during timetable generation:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}