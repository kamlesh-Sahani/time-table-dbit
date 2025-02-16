"use client";
import { useState, useEffect,memo } from "react";
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
import TimetableGrid from "@/components/timetable/TimeTableGrid";
import { TeacherStats } from "@/components/timetable/TeacherStats";
import { TeacherSubjectForm } from "@/components/timetable/TeacherSubjectForm";
import { AddCourse } from "@/components/AddCourse";
import Loader from "@/components/Loader";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { getcourseAndSem } from "@/actions/schedule.action";

function TimetablePage() {
  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [selectedSemester, setSelectedSemester] = useState<string>();
  const [courseAndSemeter, setCourseAndSemeter] =
    useState<{ course: string; semesters: { semester: number }[] }[]>();
  const [totalSemeter, setTotalSemeter] =
    useState<{ [semster: string]: number }[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uiUpdate, setUiUpdate] = useState<boolean>(false);
  const getCourseAndSemester = async () => {
    setLoading(true);

    try {
      const res = await getcourseAndSem();
      setCourseAndSemeter(JSON.parse(res.data!));
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCourseAndSemester();
  }, [uiUpdate]);
  const handleCourse = (course: string) => {
    const currentSemeter = courseAndSemeter?.filter(
      (data) => data.course === course
    );
    if (currentSemeter) {
      setTotalSemeter(currentSemeter[0].semesters);
    }
    setSelectedCourse(course);
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Timetable Management</h1>
          <div className="flex w-full max-md:flex-col gap-4">
            <Select value={selectedCourse} onValueChange={handleCourse}>
              <SelectTrigger className="w-[180px] max-md:w-full bg-white text-black">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courseAndSemeter &&
                  courseAndSemeter.map((data, index: number) => (
                    <SelectItem key={index} value={data.course}>
                      {data.course}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-[180px] max-md:w-full bg-white text-black">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {totalSemeter &&
                  totalSemeter.map((_, index) => (
                    <SelectItem key={index} value={String(index + 1)}>
                      Semester {index + 1}
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
                <AddCourse
                  setUiUpdate={setUiUpdate}
                  setIsDialogOpen={setIsDialogOpen}
                />
                <DialogClose asChild>
                  <Button variant="outline" className="mt-4 w-full">
                    Close
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {loading && <Loader />}
        {selectedCourse && selectedSemester && !loading && (
          <div className="flex flex-col gap-2">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <TimetableGrid
                  course={selectedCourse}
                  semester={selectedSemester}
                />
              </Card>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
              <Card className="p-6 w-full">
                <TeacherSubjectForm
                  course={selectedCourse}
                  semester={selectedSemester}
                />
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
export default memo(TimetablePage)