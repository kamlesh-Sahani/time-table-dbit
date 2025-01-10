"use server"; // Enabling server-side functions in App Router

import dbConnect from "@/utils/db-connect";
import Timetable from "@/models/Timetable";
import { NextRequest, NextResponse } from "next/server";

// Function to delete a subject and teacher based on day and time
export const deleteSlot = async (course: string, semester: string, day: number, time: number) => {
  try {
    await dbConnect(); // Connect to the database

    // Find the timetable document by course and semester
    const timetable = await Timetable.findOne({ course, semester });

    if (!timetable) {
      throw new Error("Timetable not found");
    }

    // Validate day and time indexes
    if (day < 0 || day >= 5 || time < 0 || time >= 6) {
      throw new Error("Invalid day or time");
    }

    // Clear the teacher and subject in the timetable data for the given day and time
    timetable.data[day][time] = { teacher: null, subject: null };

    // Save the updated timetable document
    await timetable.save();

    return { success: true, message: "Slot cleared successfully" };
  } catch (error: any) {
    console.error("Error deleting slot:", error);
    throw new Error(error.message || "Internal server error");
  }
};

