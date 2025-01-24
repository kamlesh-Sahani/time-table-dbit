import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import CourseSubject from "@/models/CourseSubject";

export async function POST(request: Request) {
  try {
    const { courseName, semester } = await request.json();

    if (!courseName || !semester) {
      return NextResponse.json(
        { error: "Course name and semester are required." },
        { status: 400 }
      );
    }

    const formattedCourseName = courseName.toUpperCase();

    await dbConnect();

    // Check if the course and semester already exist
    const existingCourse = await CourseSubject.findOne({
      course: formattedCourseName,
      semesters: semester,
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "This course and semester combination already exists." },
        { status: 409 } // Conflict
      );
    }

    // Add the course and semester if not already present
    const course = await CourseSubject.findOneAndUpdate(
      { course: formattedCourseName },
     { semesters: semester },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.log("Error adding course and semester:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
