"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newCourse } from "@/actions/schedule.action";
import toast from "react-hot-toast"
export function AddCourse({setUiUpdate,setIsDialogOpen}:{setUiUpdate:Dispatch<SetStateAction<boolean>>,setIsDialogOpen:Dispatch<SetStateAction<boolean>>}) {
  const [courseName, setCourseName] = useState<string>("");
  const [semester, setSemester] = useState<number | null>(null);
  const [loading,setLoading]=useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !semester) {
      toast.error("Course and semester are required.");
      return;
    }
    try {
      const courseData = {
        course:courseName,
        semester
      }
      setLoading(true);
      const res = await newCourse(courseData);
      console.log(res)
      if(res?.success){
        toast.success(res.message);
        setIsDialogOpen(false)
        setUiUpdate((prev)=>!prev);
      }else{
        toast.error(res.message || "Already added!");
      }
    } catch (error: any) {
     console.log(error);
     toast.error(error?.response?.data?.message || "something went wrong");
    }finally{
    setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Course Name</Label>
        <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Enter course name" />
      </div>
      <div>
        <Label>Semester</Label>
        <Input type="number"  value={semester || ""} onChange={(e) => setSemester(Number(e.target.value))} placeholder="Enter semester" />
      </div>
      <Button type="submit" className="w-full">{loading?"Adding...":"Add Course"}</Button>
    </form>
  );
}
