import { NextResponse } from "next/server";
import { adminLogin } from "@/actions/auth.action"; // Server-side logic

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const response = await adminLogin({ email, password });

    if (response.success) {
      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error:any) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
