"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { div } from "framer-motion/client";

interface AddCourseProps {
  course: string;
  semester: string;
}

export function AddCourse() {
  const { toast } = useToast();
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !semester) {
      toast({
        title: "Error",
        description: "Course  and semester are required",
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
        throw new Error("Failed to add course and semester");
      }

      toast({
        title: "Success",
        description: "course and semester added successfully",
      });

      // Reset form
      setCourseName("");
      setSemester("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course and semestew",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courseName">Course</Label>
        <Input
          id="courseName"
          className="bg-white"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Enter course name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester" >semester</Label>
        <Input
          id="semester"
          className="bg-white"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          placeholder="Enter semester"
          required
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" className="w-full bg-[#4B3F72] hover:bg-[#7160a7]" disabled={isSubmitting}>
        <Plus className="w-4 h-4 mr-2" />
        {isSubmitting ? "Adding..." : "Add course & semester"}
      </Button>
    </form>
  );
}
