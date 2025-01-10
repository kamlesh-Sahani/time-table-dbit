import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import Teacher from "@/models/Teacher";
import CourseSubject from "@/models/CourseSubject";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const course = searchParams.get("course");
    const semester = searchParams.get("semester");

    if (!course || !semester) {
      return NextResponse.json(
        { error: "Course and semester are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get all teachers with their subjects
    const teachers = await Teacher.find().select("name subjects");

    // Get subjects for the specific course and semester
    const courseSubjects = await CourseSubject.findOne({ course, semester });

    return NextResponse.json({
      teachers: teachers.map((t) => ({
        name: t.name,
        subjects: t.subjects || [],
      })),
      courseSubjects: courseSubjects?.subjects || [],
    });
  } catch (error) {
    console.error("Error fetching teachers and subjects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { course, semester, designation, teacherName, subject } =
      await request.json();

    if (!teacherName || !subject) {
      return NextResponse.json(
        { error: "Teacher name and subject are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Add or update teacher
    const teacher = await Teacher.findOneAndUpdate(
      { name: teacherName, designation: designation },
      {
        $addToSet: { subjects: subject },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Error adding teacher and subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
