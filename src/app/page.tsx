"use client";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import Download from "@/components/Download";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams ,useRouter} from "next/navigation";

import TimeTableContainer from "@/components/home/TimeTableContainer";
import TeacherCard from "@/components/home/TeacherCard";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

function HomePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("bca");
  const [selectedSemester, setSelectedSemester] = useState<string>("5");
  const [courses, setCourses] = useState<{ course: string }[]>([]);
  const [teachers, setTeachers] = useState<{ teacher: string }[]>([]);
  const timeTableRef = useRef<HTMLDivElement | null>(null);
  const [loading,setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const {toast}=useToast();
  const getTeacherAndCourse = async()=>{
    try {
      setLoading(true);
      const courseRes = await fetch("/api/get-course");
      const teacherRes = await fetch("/api/get-teacher");
      if(courseRes.ok){
        const courseData = await courseRes.json();
        setCourses(courseData.data || []);
      }

      if(teacherRes.ok){
        const teacherData = await teacherRes.json();
        setTeachers(teacherData.data || [])
      }
    } catch (error:any) {
      toast({
        title: "Error",
        description: error.message || "Network or server error occurred.",
        variant: "destructive",
      });
    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    getTeacherAndCourse();
  }, []);


  useEffect(()=>{
    const course = searchParams.get("course")?.toUpperCase();
    const sem = searchParams.get("sem");
    if(course){
      setSelectedCourse(course);
    }
    if(sem){
      setSelectedSemester(sem);
    }
  },[searchParams])

  useEffect(() => {
    router.push(`/?course=${selectedCourse?.toUpperCase()}&sem=${selectedSemester}`);
  }, [selectedCourse, selectedSemester]);

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Timetable</h1>
            <div className="flex w-full max-sm:flex-col gap-4">
              {/* Course Selector */}
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[180px] max-sm:w-full bg-white text-black">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BCA">BCA</SelectItem>
                  {courses.map((c, index) => (
                    <SelectItem key={index} value={c.course}>
                      {c.course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Semester Selector */}
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-[180px] max-sm:w-full bg-white text-black">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Download timeTableRef={timeTableRef} />
        </div>

        {selectedCourse && selectedSemester && (
          <div ref={timeTableRef}>
            <TimeTableContainer
              course={selectedCourse}
              semester={selectedSemester}
            />
          </div>
        )}
      </div>
      <div className="w-full flex flex-col gap-2 justify-center items-center">
        <hr className="text-black bg-gray-600 h-1 w-full mt-6" />
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#333333]">DBIT Heroes</h1>
          <p className="mt-2 text-lg text-gray-700 font-medium italic">
            Meet the passionate educators who are shaping the future, one lesson
            at a time.
          </p>
        </div>
        <div
          className="flex gap-2 flex-wrap w-full justify-center items-center"
          id="/teachers"
        >
          {
          loading ? <Loader />:
          teachers.map((teacher: any, index) => (
            <TeacherCard
              key={index}
              teacher={teacher.name}
              designation={teacher.designation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(HomePage), { ssr: false });
