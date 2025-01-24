"use client";
import { TimetableCell, TeacherWithSubjects } from "@/lib/types";
interface TimetableSlotProps {
  cell: TimetableCell | null;

  selectedTeacher: string;
  selectedSubject: string;
  teachers: TeacherWithSubjects[];
  onTeacherChange: (teacher: string) => void;
  onSubjectChange: (subject: string) => void;
  getTeacherSubjects: (teacher: string) => string[];
}
export function TimetableData({ cell }: TimetableSlotProps) {
  return (
    <div className="min-h-[80px] flex justify-center items-center">
      <div className="h-full flex flex-col justify-center items-center cursor-pointer">
        {cell ? (
          <>
            <p className="font-medium">{cell.teacher}</p>
            <p className="text-sm text-gray-500">{cell.subject}</p>
          </>
        ) : (
          <div className="flex justify-center items-center w-full">
            {" "}
            <p className="text-gray-400">No class</p>
          </div>
        )}
      </div>
    </div>
  );
}
