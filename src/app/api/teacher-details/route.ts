import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import Timetable from "@/models/Timetable";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherName = searchParams.get("teacher");

    if (!teacherName) {
      return NextResponse.json(
        { error: "Teacher parameter is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch all timetables
    const timetables = await Timetable.find();

    if (!timetables || timetables.length === 0) {
      return NextResponse.json(
        { error: "No timetables found" },
        { status: 404 }
      );
    }

    let teacherData: any[] = [];

    // Iterate through all timetables to find slots with the teacher's name
    timetables.forEach((timetable: any) => {
      timetable.data.forEach((daySlots: any[], dayIndex: number) => {
        daySlots.forEach((slot: any, slotIndex: number) => {
          if (slot && slot.teacher === teacherName) {
            teacherData.push({
              course: timetable.course,
              semester: timetable.semester,
              day: dayIndex, // Index for day (e.g., Monday = 0, Tuesday = 1)
              timeSlot: slotIndex, // Index for time slot
              subject: slot.subject,
              time: { start: slot.start, end: slot.end }, // Add time details
            });
          }
        });
      });
    });
    if (teacherData.length == 0) {
      return NextResponse.json(
        { message: "No data found for the specified teacher" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      teacherName,
      teacherData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
