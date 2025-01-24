import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers"

export const middleware = async(req:NextRequest)=>{
    const protectedRoute =["/timetable"];
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth-token");
    const isProtectedRoute = protectedRoute.some((route)=>{
        return req.nextUrl.pathname.startsWith(route);
    })
    if(isProtectedRoute){
        if(!authCookie?.value){
            return NextResponse.redirect(new URL("/login",req.url));
        }
    }
    if(req.nextUrl.pathname.startsWith("/login") && authCookie?.value){
        return NextResponse.redirect(new URL("/timetable",req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/timetable"],
}