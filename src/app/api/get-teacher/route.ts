import { NextResponse } from "next/server";
import dbConnect from "@/utils/db-connect";
import Teacher from "@/models/Teacher";
export async function GET(request: Request) {
  try {
    await dbConnect();
    const course = await Teacher.find();
  
    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
  
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
