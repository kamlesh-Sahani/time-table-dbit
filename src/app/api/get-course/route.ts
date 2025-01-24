import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import CourseSubject from "@/models/CourseSubject";
export async function GET(request: Request) {
  try {
    await dbConnect();
    const course = await CourseSubject.find();

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error getting course and semester:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
