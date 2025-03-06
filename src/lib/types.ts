export interface Image {
  _id: string;
  filename: string;
  url: string;
  createdAt: string;
}

export interface TimetableCell {
  teacher: string[]; // Ensure teacher is stored as an array
  subject: string;
}

export interface TeacherWithSubjects {
  name: string;
  subjects: string[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type Day = (typeof DAYS)[number];
