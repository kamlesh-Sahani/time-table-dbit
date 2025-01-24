"use server";

import dbConnect from "@/utils/db-connect";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken"
import adminModel, { AdminType } from "@/models/admin.model";
const tokenGenerate = async (admin:AdminType)=>{
    const token = await jwt.sign({_id:admin._id},process.env.JWT_SECRET!,{
        expiresIn:"10d"
    })
    return token;
}
export const adminLogin = async({email,password}:{email:string,password:string})=>{
    try {

        await dbConnect();
        if(!email || !password){
            return {
                message:"please fill the all fields",
                success:false
            }
        }
        const admin = await adminModel.findOne({email}).select("+password");
        if(!admin){
            return {
                message:"admin is not found",
                success:false
            }
        }
        const isMatch = await admin.matchPassword(password);
        if(!isMatch){
            return {
                message:"email or password is wrong",
                success:false
            }
        }

        const token = await tokenGenerate(admin);
        (await cookies()).set("auth-token",token,{maxAge:10*24*60*60*1000,httpOnly:true})
        return {
            success: true,
            message: "Admin successfully logged in.",
        };
    } catch (error:any) {
        return {
            success: false,
            message:error.message || "internal error please try again"
        }
    }
}