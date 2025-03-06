"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Save, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TimetableCell, TeacherWithSubjects } from "@/lib/types";
import { useState } from "react";
interface TimetableSlotProps {
  cell: TimetableCell | null;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  selectedTeacher: string[];
  selectedSubject: string;
  teachers: TeacherWithSubjects[];
  onTeacherChange: (teacher: string[]) => void; // ✅ Update function to handle array
  onSubjectChange: (subject: string) => void;
  getTeacherSubjects: (teacher: string) => string[];
}

export function TimetableSlot({
  cell,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  selectedTeacher,
  selectedSubject,
  teachers,
  onTeacherChange,
  onSubjectChange,
  getTeacherSubjects,
}: TimetableSlotProps) {
  const handleTeacherSelect = (teacherName: string) => {
    if (selectedTeacher.includes(teacherName)) {
      onTeacherChange(selectedTeacher.filter((t) => t !== teacherName));
    } else {
      onTeacherChange([...selectedTeacher, teacherName]);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="space-y-2">
          {/* Dropdown for selecting teachers */}
          <Select onValueChange={handleTeacherSelect}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder="Select Teacher(s)" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.name} value={teacher.name}>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedTeacher.includes(teacher.name)}
                    />
                    <span>{teacher.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Display selected teachers as tags */}
          {selectedTeacher.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border rounded">
              {selectedTeacher.map((teacher) => (
                <div
                  key={teacher}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-md"
                >
                  <span>{teacher}</span>
                  <button
                    onClick={() => handleTeacherSelect(teacher)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedTeacher.length > 0 && (
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {getTeacherSubjects(selectedTeacher[0]).map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            className="bg-[#4B3F72] hover:bg-[#7160a7]"
            disabled={selectedTeacher.length === 0 || !selectedSubject}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80px] flex justify-center items-center">
      <div
        className="h-full flex flex-col justify-center items-center cursor-pointer"
        onClick={onEdit}
      >
        {cell ? (
          <>
            {/* ✅ Ensure multiple teachers are displayed correctly */}
            <p className="font-medium">
              {cell?.teacher ? cell.teacher.join(", ") : "No teacher assigned"}
            </p>

            <p className="text-sm text-gray-900">{cell.subject}</p>
          </>
        ) : (
          <div className="flex justify-center items-center w-full">
            <p className="text-gray-700">No class</p>
          </div>
        )}
      </div>
      {cell && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="text-[#4B3F72] hover:text-[#7160a7] h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Slot</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this slot? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-[#4B3F72] hover:bg-[#7160a7]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
