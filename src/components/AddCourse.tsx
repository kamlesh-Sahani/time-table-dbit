"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react"; // Import the delete icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getCourse } from "@/actions/action.data";

interface Course {
  course: string;
  semesters: string[];
}

export function AddCourse() {
  const { toast } = useToast();
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [course, setCourse] = useState<Course[]>([]);

  async function fetchCourse() {
    try {
      const courseData = await getCourse();
      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Unable to fetch course data. Please try again later.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseName || !semester) {
      toast({
        title: "Error",
        description: "Course and semester are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/course-semester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName,
          semester,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error;
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Course and semester added successfully.",
      });

      setCourseName("");
      setSemester("");
      fetchCourse();
    } catch (error:any) {
      console.error("Error adding course and semester:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add course and semester.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseToDelete: string) => {
    try {
      const response = await fetch(`/api/delete-course/${courseToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred while deleting the course";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
      fetchCourse();
    } catch (error:any) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="flex w-full justify-center items-center py-12">
      <div className="flex max-w-4xl gap-4 w-full max-sm:flex-col max-sm:justify-center max-sm:items-center justify-between items-start">
        <div className="w-full sm:w-1/2 overflow-x-auto bg-white rounded-2xl shadow-lg p-4">
          <table className="min-w-full table-auto text-gray-700">
            <thead className="bg-[#4B3F72] text-white">
              <tr>
                <th className="py-2 px-4 text-center text-lg font-semibold">
                  Course
                </th>
                <th className="py-2 px-4 text-center text-lg font-semibold">
                  Semester
                </th>
                <th className="py-2 px-4 text-center text-lg font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {course.map((c, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4 text-center">{c.course}</td>
                  <td className="py-3 px-4 text-center">{c.semesters}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(c.course)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-1/2 space-y-6 bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="space-y-4">
            <Label
              htmlFor="courseName"
              className="text-xl font-semibold text-gray-700"
            >
              Course
            </Label>
            <Input
              id="courseName"
              className="bg-white border-2 border-gray-300 rounded-lg shadow-sm w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#4B3F72] focus:border-[#4B3F72]"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <Label
              htmlFor="semester"
              className="text-xl font-semibold text-gray-700"
            >
              Semester
            </Label>
            <Input
              id="semester"
              className="bg-white border-2 border-gray-300 rounded-lg shadow-sm w-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#4B3F72] focus:border-[#4B3F72]"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Enter semester"
              required
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4B3F72] hover:bg-[#7160a7] text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isSubmitting ? "Adding..." : "Add course & semester"}
          </Button>
        </form>
      </div>
    </section>
  );
}
