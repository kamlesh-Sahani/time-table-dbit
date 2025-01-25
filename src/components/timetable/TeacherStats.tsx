
"use client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "9:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-1:00",
  "2:00-3:00",
  "3:00-4:00",
];

export function TeacherStats() {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[0]);
  const [freeTeachers, setFreeTeachers] = useState<string[]>([]);
  const [busyTeachers, setBusyTeachers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    fetchTeacherAvailability();
  }, [selectedDay, selectedTime]);

  const fetchTeacherAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/teacher-availability?day=${selectedDay}&time=${selectedTime}`
      );
      
      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      const data = await response.json();
      setFreeTeachers(data.freeTeachers || []);
      setBusyTeachers(data.busyTeachers || []);
    } catch (error:any) {
      toast({
        title: "Error",
        description:error.message,
        variant: "destructive",
      });
      setFreeTeachers([]);
      setBusyTeachers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Teacher Availability</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 overflow-y-auto h-[400px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-600">
                Available Teachers ({freeTeachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : freeTeachers.length > 0 ? (
                <ul className="space-y-1">
                  {freeTeachers.map((teacher) => (
                    <li
                      key={teacher}
                      className="text-sm padding-2 rounded bg-green-50 dark:bg-green-900/10 p-2"
                    >
                      {teacher}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No available teachers</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-red-600">
                Busy Teachers ({busyTeachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : busyTeachers.length > 0 ? (
                <ul className="space-y-1">
                  {busyTeachers.map((teacher) => (
                    <li
                      key={teacher}
                      className="text-sm padding-2 rounded bg-red-50 dark:bg-red-900/10 p-2"
                    >
                      {teacher}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No busy teachers</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}