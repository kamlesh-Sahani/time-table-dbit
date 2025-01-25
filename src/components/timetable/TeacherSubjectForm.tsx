"use client";

import { useState, useEffect } from "react";
import { Plus, X, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Teacher {
  name: string;
  designation: string;
  subjects: string[];
}

interface TeacherSubjectFormProps {
  course: string;
  semester: string;
}

export function TeacherSubjectForm({ course, semester }: TeacherSubjectFormProps) {
  const { toast } = useToast();
  const [teacherName, setTeacherName] = useState("");
  const [designation, setDesignation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isCustomTeacher, setIsCustomTeacher] = useState(false);

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/get-teacher");
      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred while";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      const data = await response.json();
      setTeachers(data.data || []);
      toast({
        title: "Success",
        description: "Teachers fetched successfully.",
      });
    } catch (error) {
    
      toast({
        title: "Error",
        description: "Unable to fetch teachers. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleTeacherSelection = (value: string) => {
    setTeacherName(value);
    const selectedTeacher = teachers.find((teacher) => teacher.name === value);
    if (selectedTeacher) {
      setDesignation(selectedTeacher.designation || "");
      setSubject(selectedTeacher.subjects || []);
    } else {
      setDesignation("");
      setSubject([]);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!teacherName) {
      toast({
        title: "Error",
        description: "No teacher selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/delete-teacher/${teacherName}`, {
        method: "DELETE",
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
        description: `Teacher ${teacherName} deleted successfully.`,
      });

      setTeachers(teachers.filter((teacher) => teacher.name !== teacherName));
      setTeacherName("");
      setDesignation("");
      setSubject([]);
    } catch (error) {
    
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherName || !subject.length) {
      toast({
        title: "Error",
        description: "Teacher name and at least one subject are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/teachers-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          semester,
          teacherName,
          subject,
          designation,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

      toast({
        title: "Success",
        description: "Teacher and subject added successfully.",
      });

      setTeacherName("");
      setDesignation("");
      setSubject([]);
      setIsCustomTeacher(false);
      fetchTeachers();
    } catch (error: any) {
    
      toast({
        title: "Error",
        description: error.message || "Failed to add teacher and subject.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      setSubject([...subject, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
      toast({
        title: "Subject Added",
        description: `Subject "${e.currentTarget.value.trim()}" added.`,
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Teacher Name</Label>
        {isCustomTeacher ? (
          <Input
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Enter teacher name"
            required
            disabled={isSubmitting}
          />
        ) : (
          <Select
            onValueChange={(value) => {
              if (value === "custom") {
                setIsCustomTeacher(true);
                setTeacherName("");
                setDesignation("");
                setSubject([]);
              } else {
                handleTeacherSelection(value);
              }
            }}
            defaultValue=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.name} value={teacher.name}>
                  {teacher.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">Add New Teacher</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {teacherName && (
        <Button
          type="button"
          onClick={handleDeleteTeacher}
          className="w-full bg-red-500 hover:bg-red-600 text-white mt-4"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete Teacher
        </Button>
      )}

      <div className="space-y-2">
        <Label htmlFor="designation">Teacher Designation</Label>
        <Input
          id="designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="Enter teacher designation"
        />
      </div>

      <div className="space-y-2">
        <Label>Subjects</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {subject.map((tag, index) => (
            <span
              key={index}
              className="bg-[#4B3F72] text-white px-2 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  setSubject(subject.filter((_, i) => i !== index))
                }
                className="ml-2"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <Input
          placeholder="Press enter to add subject"
          onKeyDown={handleAddTag}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-[#4B3F72] hover:bg-[#7160a7]"
        disabled={isSubmitting}
      >
        <Plus className="w-4 h-4 mr-2" />
        {isSubmitting ? "Adding..." : "Add Teacher & Subject"}
      </Button>
    </form>
  );
}