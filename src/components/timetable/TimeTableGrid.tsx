"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  TimetableCell,
  TeacherWithSubjects,
  TimeSlot,
  DAYS,
} from "@/lib/types";
import { TimetableSlot } from "@/components/timetable-slot";
import { TimeSlotEditor } from "@/components/time-slot-editor";
import { AddTimeSlot } from "../add-time-slote";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TimetableGridProps {
  course: string;
  semester: string;
}

export function TimetableGrid({ course, semester }: TimetableGridProps) {
  const { toast } = useToast();
  const [timetable, setTimetable] = useState<(TimetableCell | null)[][]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [editingCell, setEditingCell] = useState<{
    day: number;
    time: number;
  } | null>(null);
  const [teachers, setTeachers] = useState<TeacherWithSubjects[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    fetchTimetableData();
    fetchTeachersAndSubjects();
    fetchTimeSlots();
  }, [course, semester]);

  const fetchTimetableData = async () => {
    try {
      const response = await fetch(
        `/api/timetable?course=${course}&semester=${semester}`
      );
      const data = await response.json();
      setTimetable(data.timetable || Array(5).fill(Array(6).fill(null)));
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  const fetchTeachersAndSubjects = async () => {
    try {
      const response = await fetch(
        `/api/teachers-subjects?course=${course}&semester=${semester}`
      );
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers and subjects:", error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(
        `/api/time?course=${course}&semester=${semester}`
      );
      const data = await response.json();
      setTimeSlots(data.slots || []);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handleCellEdit = (day: number, time: number) => {
    setEditingCell({ day, time });
    const currentCell = timetable[day]?.[time];
    if (currentCell) {
      setSelectedTeacher(currentCell.teacher || "");
      setSelectedSubject(currentCell.subject || "");
    } else {
      setSelectedTeacher("");
      setSelectedSubject("");
    }
  };

  const handleTeacherChange = (teacherName: string) => {
    setSelectedTeacher(teacherName);
    setSelectedSubject("");
  };
  const handleDeleteSlot = async (day: number, time: number) => {
    try {
      const response = await fetch("/api/timetable", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          semester,
          day,
          time,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Update local state
      const newTimetable = [...timetable];
      if (!Array.isArray(newTimetable[day])) {
        newTimetable[day] = Array(timeSlots.length).fill(null);
      }
      newTimetable[day][time] = null;
      setTimetable(newTimetable);

      toast({
        title: "Success",
        description: "Slot deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCellSave = async () => {
    if (!selectedTeacher || !selectedSubject) {
      toast({
        title: "Error",
        description: "Please select both teacher and subject",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/timetable", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          semester,
          day: editingCell?.day,
          time: editingCell?.time,
          teacher: selectedTeacher,
          subject: selectedSubject,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Update local state
      const newTimetable = [...timetable];
      if (!Array.isArray(newTimetable[editingCell!.day])) {
        newTimetable[editingCell!.day] = Array(timeSlots.length).fill(null);
      }
      newTimetable[editingCell!.day][editingCell!.time] = {
        teacher: selectedTeacher,
        subject: selectedSubject,
      };
      setTimetable(newTimetable);
      setEditingCell(null);
      setSelectedTeacher("");
      setSelectedSubject("");

      toast({
        title: "Success",
        description: "Timetable updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTimeSlotSave = async (
    index: number,
    start: string,
    end: string
  ) => {
    try {
      const response = await fetch("/api/time", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          semester,
          index,
          start,
          end,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update time slot");
      }

      const data = await response.json();
      setTimeSlots(data.slots);
      toast({
        title: "Success",
        description: "Time slot updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddTimeSlot = async (start: string, end: string) => {
    try {
      const response = await fetch("/api/time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          semester,
          start,
          end,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add time slot");
      }

      const data = await response.json();
      setTimeSlots(data.slots);
      // Expand timetable array to accommodate new time slot
      setTimetable((prev) => prev.map((row) => [...row, null]));
      toast({
        title: "Success",
        description: "Time slot added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTeacherSubjects = (teacherName: string) => {
    const teacher = teachers.find((t) => t.name === teacherName);
    return teacher?.subjects || [];
  };
  const handleDeleteTimeSlot = async (index: number) => {
    try {
      const response = await fetch("/api/time", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course,
          semester,
          index,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete time slot");
      }

      // Update the timeSlots state by removing the specified slot
      const newTimeSlots = timeSlots.filter((_, i) => i !== index);
      setTimeSlots(newTimeSlots);

      // Update the timetable state by removing the column for the deleted slot
      const newTimetable = timetable.map((row) =>
        row.filter((_, i) => i !== index)
      );
      setTimetable(newTimetable);

      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 bg-gradient-to-tr  p-2 rounded-sm">
      <div className="flex justify-between ">
        <h1 className="text-3xl font-bold text-center text-white">
          {course.charAt(0).toUpperCase() + course.slice(1).toLowerCase()} -{" "}
          {semester} Timetable
        </h1>
        <AddTimeSlot onAdd={handleAddTimeSlot} />
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-center border-collapse ">
          <thead className="bg-[#4B3F72]  text-white">
            <tr>
              <th className="border p-2">Time/Day</th>
              {DAYS.map((day, index) => (
                <th key={index} className="border py-8 ">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {timeSlots.map((slot, timeIndex) => (
              <tr key={timeIndex}>
                <td className="border p-2 font-medium bg-[#4B3F72] text-white">
                  <TimeSlotEditor
                    timeSlot={slot}
                    index={timeIndex}
                    onSave={handleTimeSlotSave}
                    onDelete={handleDeleteTimeSlot}
                  />
                </td>
                {DAYS.map((_, dayIndex) => (
                  <td
                    key={`${dayIndex}-${timeIndex}`}
                    className="border p-2 bg-gray-100 border-black"
                  >
                    <TimetableSlot
                      cell={timetable[dayIndex]?.[timeIndex]}
                      isEditing={
                        editingCell?.day === dayIndex &&
                        editingCell?.time === timeIndex
                      }
                      onEdit={() => handleCellEdit(dayIndex, timeIndex)}
                      onDelete={() => handleDeleteSlot(dayIndex, timeIndex)}
                      onSave={handleCellSave}
                      onCancel={() => setEditingCell(null)}
                      selectedTeacher={selectedTeacher}
                      selectedSubject={selectedSubject}
                      teachers={teachers}
                      onTeacherChange={handleTeacherChange}
                      onSubjectChange={setSelectedSubject}
                      getTeacherSubjects={getTeacherSubjects}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}