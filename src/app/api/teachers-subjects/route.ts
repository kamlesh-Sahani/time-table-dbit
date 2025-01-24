import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import CourseSubject from "@/models/CourseSubject";
import Teacher from "@/models/Teacher";

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
    const teachers = await Teacher.find().select("name subjects");
    const courseSubjects = await CourseSubject.findOne({ course, semester });

    return NextResponse.json({
      teachers: teachers.map((t) => ({
        name: t.name,
        subjects: t.subjects || [],
      })),
      courseSubjects: courseSubjects?.subjects || [],
    });
  } catch (error) {
    console.log("Error fetching teachers and subjects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const { designation, teacherName, subject,id } = await request.json();
    console.log("Updated Teacher Data",teacherName, subject, designation,id);

    if (!teacherName || !subject) {
      return NextResponse.json(
        { error: "Teacher name and subject are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find or create a teacher document
    const teacher = await Teacher.findOneAndUpdate(
      { name: teacherName },
      {
        $set: { designation },
        $addToSet: { subjects: subject }, 
      },
      { upsert: true, new: true } 
    );

    return NextResponse.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.log("Error updating teacher and subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

