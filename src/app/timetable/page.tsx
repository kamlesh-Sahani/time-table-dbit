"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimetableGrid } from "@/components/timetable/TimeTableGrid";
import { TeacherStats } from "@/components/timetable/TeacherStats";
import { TeacherSubjectForm } from "@/components/timetable/TeacherSubjectForm";
import { AddCourse } from "@/components/AddCourse";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function TimetablePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("BCA");
  const [selectedSemester, setSelectedSemester] = useState<string>("5");
  const [course, setCourse] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [courseUpdate, setCourseUpdate] = useState<boolean>(false);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/get-course");

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error;
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const courseData = await response.json();
      setCourse(courseData.data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [courseUpdate]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Timetable Management</h1>
          <div className="flex w-full max-md:flex-col gap-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px] max-md:w-full bg-white text-black">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {course.map((c: any, index: number) => (
                  <SelectItem key={index} value={c.course}>
                    {c.course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-[180px] max-md:w-full bg-white text-black">
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

            {/* Dialog for Add Course */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#4B3F72] max-md:w-full hover:bg-[#7160a7]">
                  Add Course <Plus className="w-4 h-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>
                <AddCourse setCourseUpdate={setCourseUpdate} closeDialog={() => setIsDialogOpen(false)} />
                <DialogClose asChild>
                  <Button variant="outline" className="mt-4 w-full">Close</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-800 border border-red-400 rounded">
            {error}
          </div>
        )}

        {loading && <Loader />}

        {selectedCourse && selectedSemester && !loading && !error && (
          <div className="flex flex-col gap-2">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <TimetableGrid course={selectedCourse} semester={selectedSemester} />
              </Card>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
              <Card className="p-6 w-full">
                <TeacherSubjectForm course={selectedCourse} semester={selectedSemester} />
              </Card>
              <Card className="p-6 w-full">
                <TeacherStats />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
