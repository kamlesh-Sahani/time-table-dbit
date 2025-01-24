import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import Time from "@/models/Time";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const course = searchParams.get('course');
    const semester = searchParams.get('semester');

    if (!course || !semester) {
      return NextResponse.json(
        { message: "Course and semester are required" },
        { status: 400 }
      );
    }

    let timeSlots = await Time.findOne({ course, semester });
    
    if (!timeSlots) {
      // Create default time slots if none exist
      timeSlots = await Time.create({
        course,
        semester,
        slots: [
          { start: "9:00", end: "10:00" },
          { start: "10:00", end: "11:00" },
          { start: "11:00", end: "12:00" },
          { start: "12:00", end: "13:00" },
          { start: "14:00", end: "15:00" },
          { start: "15:00", end: "16:00" },
        ],
      });
    }

    return NextResponse.json(timeSlots);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { course, semester, start, end } = await request.json();

    if (!course || !semester || !start || !end) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const timeSlots = await Time.findOne({ course, semester });
    
    if (!timeSlots) {
      return NextResponse.json(
        { message: "Time slots not found" },
        { status: 404 }
      );
    }

    timeSlots.slots.push({ start, end });
    await timeSlots.save();

    return NextResponse.json(timeSlots);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { course, semester, index, start, end } = await request.json();

    if (!course || !semester || index === undefined || !start || !end) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const timeSlots = await Time.findOne({ course, semester });
    
    if (!timeSlots) {
      return NextResponse.json(
        { message: "Time slots not found" },
        { status: 404 }
      );
    }

    if (index >= timeSlots.slots.length) {
      return NextResponse.json(
        { message: "Invalid time slot index" },
        { status: 400 }
      );
    }

    timeSlots.slots[index] = { start, end };
    await timeSlots.save();

    return NextResponse.json(timeSlots);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
    try {
      await dbConnect();
      const { course, semester, index } = await request.json();
  
      if (!course || !semester || index === undefined) {
        return NextResponse.json(
          { message: "Course, semester, and index are required" },
          { status: 400 }
        );
      }
  
      const timeSlots = await Time.findOne({ course, semester });
  
      if (!timeSlots) {
        return NextResponse.json(
          { message: "Time slots not found" },
          { status: 404 }
        );
      }
  
      if (index < 0 || index >= timeSlots.slots.length) {
        return NextResponse.json(
          { message: "Invalid time slot index" },
          { status: 400 }
        );
      }
  
      // Remove the specified time slot
      timeSlots.slots.splice(index, 1);
      await timeSlots.save();
  
      return NextResponse.json(timeSlots);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
  