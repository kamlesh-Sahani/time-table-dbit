import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import CourseSubject from "@/models/CourseSubject";
import Timetable from "@/models/Timetable";

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const courseToDelete = url.pathname.split("/").pop();
    console.log("Course to delete:", courseToDelete);

    if (!courseToDelete) {
      return NextResponse.json(
        { error: "Course is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the course exists in any timetable
    const timetable = await Timetable.find({ "data.course": courseToDelete });

    if (timetable.length > 0) {
      return NextResponse.json(
        {
          message: "Course is assigned in the timetable and cannot be deleted",
        },
        { status: 400 }
      );
    }

    // Proceed to delete the course from the CourseSubject collection
    const result = await CourseSubject.deleteOne({ course: courseToDelete });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
