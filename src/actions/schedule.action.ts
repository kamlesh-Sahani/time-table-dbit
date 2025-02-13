"use server";
import ScheduleModel from "@/models/schedule.model";
import dbConnect from "@/utils/db-connect";
import generateTimeSlots from "@/utils/generateTimeSlots.util";

export const newCourse = async (courseData: { course: string; semester: number }) => {
  try {
    await dbConnect();
    const { course, semester } = courseData;

    if (!course || !semester) {
      return { success: false, message: "Course and semester are required." };
    }

    const existingSchedule = await ScheduleModel.findOne({ course });
    if (existingSchedule) {
      return { success: false, message: "Schedule already exists." };
    }

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Create schedule with dayName and slots
    const emptySchedule = weekdays.map((day) => ({
      dayName: day,
      slots: generateTimeSlots(), // This should return an array of time slots
    }));

    console.log(emptySchedule,"emptySchedule")
    // Create new schedule
    console.log({
        course,
        semester,
        schedule: emptySchedule, // Using "schedule" instead of "day"
      },"chekc ")
    const newSchedule = await ScheduleModel.create({
      course,
      semester,
      schedule: emptySchedule, // Using "schedule" instead of "day"
    });

    if (!newSchedule) {
      return { success: false, message: "Failed to create schedule." };
    }

    return {
      success: true,
      message: "Course added successfully.",
      course: JSON.stringify(newSchedule),
    };

  } catch (error: any) {
    return { success: false, message: error.message || "Internal server error." };
  }
};

export const getcourse = async ()=>{
    try{
        
    }catch(error:any){
        return{
            success:false,
            message:error.message || "internal error"
        }
    }
}