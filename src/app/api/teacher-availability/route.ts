
import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import Timetable from "@/models/Timetable";
import Teacher from "@/models/Teacher";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:00",
  "2:00-3:00",
  "3:00-4:00",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");
    const time = searchParams.get("time");

    if (!day || !time) {
      return NextResponse.json(
        { error: "Day and time are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get all teachers
    const allTeachers = await Teacher.find().select('name');
    const allTeacherNames = allTeachers.map(t => t.name);

    // Get busy teachers for the specified time slot
    const timetables = await Timetable.find();
    const dayIndex = DAYS.indexOf(day);
    const timeIndex = TIME_SLOTS.indexOf(time);

    const busyTeachers = new Set(
      timetables.flatMap((tt) => {
        const cell = tt.data?.[dayIndex]?.[timeIndex];
        return cell?.teacher ? [cell.teacher] : [];
      })
    );

    // Calculate free teachers
    const freeTeachers = allTeacherNames.filter(
      (teacher) => !busyTeachers.has(teacher)
    );

    return NextResponse.json({
      freeTeachers,
      busyTeachers: Array.from(busyTeachers),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}