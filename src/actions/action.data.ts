"use server"; 
import dbConnect from "@/utils/db-connect";
import Timetable from "@/models/Timetable";
import { NextRequest, NextResponse } from "next/server";
import CourseSubject from "@/models/CourseSubject";
export const deleteSlot = async (course: string, semester: string, day: number, time: number) => {
  try {
    await dbConnect(); 
    const timetable = await Timetable.findOne({ course, semester });
    if (!timetable) {
      throw new Error("Timetable not found");
    }
    if (day < 0 || day >= 5 || time < 0 || time >= 6) {
      throw new Error("Invalid day or time");
    }
    timetable.data[day][time] = { teacher: null, subject: null };
    await timetable.save();
    return { success: true, message: "Slot cleared successfully" };
  } catch (error: any) {
    console.error("Error deleting slot:", error);
    throw new Error(error.message || "Internal server error");
  }
};


export const getCourse = async () => {
  try {
    await dbConnect();
    const course = await CourseSubject.find();
    const mydata = course.map((c) => ({
      course: c.course,
      semesters: c.semesters,
    }));
    return mydata;
  } catch (error: any) {
    console.error("Error fetching course data:", error);
    throw new Error(error.message || "Internal server error");
  }
};