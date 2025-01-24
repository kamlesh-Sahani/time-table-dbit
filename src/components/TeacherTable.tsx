"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
type TimetableData = {
  day: number; 
  subject: string;
  time: { start: string; end: string };
  course: string;
  semester: string;
};

type TeacherData = {
  teacherName: string;
  teacherData: TimetableData[]; 
};

const TeacherTable = ({ selectedTeacher ,setSelectedTeacher}: { selectedTeacher: string,setSelectedTeacher:any }) => {
  const {toast}=useToast();
  const [timetable, setTimetable] = useState<TeacherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const Days: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const getTeacherData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/teacher-details?teacher=${selectedTeacher}`
      );
      const data = await response.json();
      setSelectedTeacher(data?.teacherName || selectedTeacher)
      setTimetable(data);
    }catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the slot.",
        variant: "destructive", 
      });
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTeacher) {
      getTeacherData();
    }
  }, [selectedTeacher]);
  
  const groupedByDay = timetable?.teacherData?.reduce((acc, curr) => {
    const day = Days[curr.day];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(curr);
    return acc;
  }, {} as Record<string, TimetableData[]>);

  const toggleExpandDay = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className="flex flex-col ">
      <Card className="p-2 shadow-lg rounded-lg sm:p-4 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Timetable for{" "}
          <span className="text-[#4B3F72]">{timetable?.teacherName}</span>
        </h2>
        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="mt-4">
            {groupedByDay ? (
              Object.entries(groupedByDay).map(([day, lessons], index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    {day}
                  </h3>
                  <div className="grid grid-cols-4 gap-4 text-gray-600 font-semibold">
                    <div>Subject</div>
                    <div>Time</div>
                    <div>Course</div>
                    <div>Semester</div>
                  </div>
                  {(expandedDays[day]
                    ? lessons
                    : lessons.slice(0, 1)
                  ).map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="grid grid-cols-4 gap-4 items-center mt-4 p-4 bg-[#4B3F72] text-white rounded-lg  hover:shadow-lg transition-shadow"
                    >
                      <div >{lesson.subject}</div>
                      <div >
                        {lesson.time.start} - {lesson.time.end}
                      </div>
                      <div >{lesson.course}</div>
                      <div >{lesson.semester}</div>
                    </div>
                  ))}
                  {lessons.length > 1 && (
                    <button
                      className="text-blue-600 underline mt-4"
                      onClick={() => toggleExpandDay(day)}
                    >
                      {expandedDays[day] ? "View Less" : "View All"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">
                No timetable available for this teacher.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherTable;
