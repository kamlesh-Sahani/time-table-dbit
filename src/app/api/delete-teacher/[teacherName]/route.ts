import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import Teacher from "@/models/Teacher";
import Timetable from "@/models/Timetable";

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const teacherName = decodeURIComponent(url.pathname.split("/").pop()!); // Decode the teacher name
    
    console.log(teacherName); // This should now log "Poonam Arora" instead of "Poonam%20Arora"
    
    if (!teacherName) {
      return NextResponse.json(
        { error: "Teacher name is required" },
        { status: 400 }
      );
    }

    await dbConnect(); // Connect to the database
    const timetables = await Timetable.find({});

    let teacherFoundInTimetable = false;

    // Iterate through all timetables
    for (let k = 0; k < timetables.length; k++) {
      const timetable = timetables[k];

      // Skip empty timetables
      if (timetable.data.length === 0) {
        continue;
      }

      // Iterate through the timetable slots
      for (let i = 0; i < timetable.data.length; i++) {
        for (let j = 0; j < timetable.data[i].length; j++) {
          const classData = timetable.data[i][j];
          if (classData && classData.teacher === teacherName) {
            teacherFoundInTimetable = true;
            timetable.data[i][j] = null; // Remove the teacher from the timetable slot
          }
        }
      }

      // Save the updated timetable
      await timetable.save();
    }

    // Now check if the teacher was found in the timetable and then delete from Teacher collection
    if (teacherFoundInTimetable) {
      const teacherResponse = await Teacher.deleteOne({ name: teacherName });

      if (teacherResponse.deletedCount === 0) {
        // If no teacher is found to delete, return not found response
        return NextResponse.json(
          { message: "Teacher not found in the Teacher collection" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Teacher and associated timetable entries deleted successfully",
        },
        { status: 200 }
      );
    }

    // If teacher is not found in any timetable, delete the teacher anyway (if exists in the Teacher collection)
    const teacherResponse = await Teacher.deleteOne({ name: teacherName });

    if (teacherResponse.deletedCount === 0) {
      return NextResponse.json(
        { message: "Teacher not found in the Teacher collection" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Teacher deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting teacher and timetables:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
