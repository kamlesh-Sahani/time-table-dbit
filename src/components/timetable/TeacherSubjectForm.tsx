"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
interface TeacherSubjectFormProps {
  course: string;
  semester: string;
}

export function TeacherSubjectForm({
  course,
  semester,
}: TeacherSubjectFormProps) {
  const { toast } = useToast();
  const [teacherName, setTeacherName] = useState("");
  const [designation, setDesignation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !subject) {
      toast({
        title: "Error",
        description: "Teacher name and subject are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/teachers-subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          semester,
          teacherName,
          subject,
          designation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add teacher and subject");
      }

      toast({
        title: "Success",
        description: "Teacher and subject added successfully",
      });

      // Reset form
      setTeacherName("");
      setDesignation("");
      setSubject([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add teacher and subject",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault();
      setSubject([...subject, e.currentTarget.value]);
      e.currentTarget.value = "";
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="teacherName">Teacher Name</Label>
        <Input
          id="teacherName"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Enter teacher name"
          required
          disabled={isSubmitting}
        />
      </div>
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
        <Label>Subject</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {subject.map((tag, index) => (
            <span
              key={index}
              className="bg-[#4B3F72]  text-white px-2 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => setSubject(subject.filter((_, i) => i !== index))}
                className="ml-2"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <Input placeholder="Press enter to add subject" onKeyDown={handleAddTag} />
      </div>

      <Button type="submit" className="w-full bg-[#4B3F72] hover:bg-[#7160a7]" disabled={isSubmitting}>
        <Plus className="w-4 h-4 mr-2" />
        {isSubmitting ? "Adding..." : "Add Teacher & Subject"}
      </Button>
    </form>
  );
}
