"use client";
import { useState, useEffect } from "react";
import { TimetableCell, TimeSlot, DAYS } from "@/lib/types";
import dynamic from "next/dynamic";
import { useToast } from "@/hooks/use-toast";
import Loader from "../Loader";
import toast from "react-hot-toast";
interface TimetableGridProps {
  course: string;
  semester: string;
}
function TimeTableContainer({ course, semester }: TimetableGridProps) {
  const [timetable, setTimetable] = useState<(TimetableCell | null)[][]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const timeTableData = async () => {
    try {
      setLoading(true);
      const slotRes = await fetch(
        `/api/time?course=${course}&semester=${semester}`
      );
      const timeTableRes = await fetch(
        `/api/timetable?course=${course}&semester=${semester}`
      );
      const timeTableData = await timeTableRes.json();
      const slotData = await slotRes.json();
      setTimetable(
        timeTableData.timetable || Array(5).fill(Array(6).fill(null))
      );
      setTimeSlots(slotData.slots || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while fetching the data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    timeTableData();
  }, [course, semester]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="p-2   w-full ">
          <h1 className="text-3xl font-bold text-center text-black pb-4">
            {course?.charAt(0)?.toUpperCase() + course?.slice(1).toLowerCase()}{" "}
            - {semester} Timetable
          </h1>
          <div className="flex flex-col justify-center w-full  gap-2 z-20  overflow-x-auto">
            <div className="w-full flex flex-col justify-center sm:items-center  gap-2">
              {/* Header Row */}
              <div className="w-full flex gap-2 items-center sm:justify-center ">
                <div className="bg-[#AFCDE9] border-2 border-black flex justify-center items-center h-[70px] min-w-[150px] shadow-md rounded cursor-pointer">
                  <h2 className="font-semibold drop-shadow-md rounded text-xl">
                    Time
                  </h2>
                </div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="bg-[#FFA5BA] border-2 border-black flex justify-center items-center h-[70px] min-w-[150px]  shadow-md rounded cursor-pointer"
                  >
                    <h2 className="font-semibold drop-shadow-md rounded text-xl">
                      {day}
                    </h2>
                  </div>
                ))}
              </div>

              {timeSlots.map((slot, timeIndex) => (
                <div
                  className="flex gap-2 items-center text-center"
                  key={timeIndex}
                >
                  <div className="bg-[#AFCDE9] border-2 border-black flex justify-center  items-center h-[70px] min-w-[150px] shadow-md rounded cursor-pointer">
                    <h2 className="font-semibold drop-shadow-md rounded text-lg">
                      {slot.start} - {slot.end}
                    </h2>
                  </div>
                  {DAYS.map((day, dayIndex) => (
                    <div
                      key={`${day}-${timeIndex}`}
                      className="bg-transparent border-2 border-[#333333] flex justify-center items-center h-[70px] min-w-[150px] shadow-md rounded cursor-pointer px-2"
                    >
                      <div className="flex flex-col text-center justify-center items-center w-full h-full overflow-hidden">
                        {timetable[dayIndex]?.[timeIndex] ? (
                          <div className="flex flex-col">
                            <span className="text-[14px] mt-2 font-bold capitalize">
                              {timetable[dayIndex][timeIndex]?.subject}
                            </span>
                            <div className="flex flex-col text-[12px] mb-2 font-medium capitalize">
                              {Array.isArray(
                                timetable[dayIndex][timeIndex]?.teacher
                              ) ? (
                                timetable[dayIndex][timeIndex]?.teacher.map(
                                  (t: string, i: number) => (
                                    <span key={i}>{t}</span>
                                  )
                                )
                              ) : (
                                <span>
                                  {timetable[dayIndex][timeIndex]?.teacher}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[15px] font-medium capitalize">
                            No Class
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default dynamic(() => Promise.resolve(TimeTableContainer), {
  ssr: false,
});
