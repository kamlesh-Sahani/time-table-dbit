"use server";
import ScheduleModel from "@/models/schedule.model";
import dbConnect from "@/utils/db-connect";
import generateTimeSlots from "@/utils/generateTimeSlots.util";

export const newCourse = async (courseData: {
  course: string;
  semester: number;
}) => {
  try {
    await dbConnect(); // Connect to the DB
    const { course, semester } = courseData;

    if (!course || !semester) {
      return { success: false, message: "Course and semester are required." };
    }

    const existingSchedule = await ScheduleModel.findOne({ course });
    if (existingSchedule) {
      return {
        success: false,
        message: "Schedule already exists for this course.",
      };
    }
    const weekdays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const emptySchedule = weekdays.map((day) => ({
      dayName: day,
      slots: generateTimeSlots(), // Generating the time slots for the day
    }));

    // Populate the semesters with the corresponding number of schedules
    const semesterArray = [];
    for (let i = 0; i < semester; i++) {
      semesterArray.push({
        semester: i + 1,
        schedule: emptySchedule, // This will be the same for each semester
      });
    }

    // Create the new course schedule in the database
    const newSchedule = await ScheduleModel.create({
      course,
      semesters: semesterArray, // Multiple semesters with their own schedule
    });

    if (!newSchedule) {
      return { success: false, message: "Failed to create course schedule." };
    }

    return {
      success: true,
      message: "Course and schedule added successfully.",
      course: JSON.stringify(newSchedule),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Internal server error.",
    };
  }
};

export const getcourseAndSem = async () => {
  try {
    await dbConnect();
    const data = await ScheduleModel.find({}).select(
      "course semesters.semester"
    );
    console.log(data, "from sever");
    /**
     *
     * {
     * course:BCA
     * semeter-[1,2,3,4,5]
     * }
     */
    return {
      success: true,
      message: "course and semester finded",
      data: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "internal error",
    };
  }
};

export const getSchedule = async ({
  course,
  semester,
}: {
  course: string;
  semester: number;
}) => {
  try {
    console.log("Cpourse and semester", course, semester);
    const schedule = await ScheduleModel.findOne(
      { course, "semesters.semester": semester },
      { "semesters.$": 1 }
    );
    console.log("Datakjkdjfld", schedule);
    if (!schedule) {
      return {
        message: "schedule is not found",
        success: false,
      };
    }

    return {
      success: true,
      message: "schedule found successfully",
      schedule: JSON.stringify(schedule),
    };
  } catch (error: any) {
    return {
      message: error.message || "Internal error",
      success: false,
    };
  }
};
