

export type UserRole = 'admin' | 'teacher' | 'parent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface Teacher extends User {
  role: UserRole;
  classIds: string[];
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  parentEmail?: string;
  parentPhone?: string;
  email?: string;
  phone?: string;
  birthdayMonth?: string;
  birthdayDay?: string;
  avatar?: string;
}

export interface Class {
  id: string;
  name: string;
  ageGroup: string;
  room: string;
  lessonLink?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  studentId: string;
  status: 'present' | 'absent';
  sevenDaysStudy: boolean;
  recordedBy: string; // teacher id
}

export interface ClassOffering {
  id: string;
  classId: string;
  date: string;
  amount: number;
}


// 10 Standard Sabbath School Classes as placeholders
export const initialClasses: Class[] = [
  { id: 'c1', name: 'Beginner', ageGroup: '1-3 years old', room: 'Room 101', lessonLink: 'https://beginner.aliveinjesus.info/' },
  { id: 'c2', name: 'Kindergarten', ageGroup: '4-6 years old', room: 'Room 102', lessonLink: 'https://kindergarten.aliveinjesus.info/students' },
  { id: 'c3', name: 'Primary', ageGroup: '7-9 years old', room: 'Room 103', lessonLink: 'https://primary.aliveinjesus.info/students' },
  { id: 'c10', name: 'Junior', ageGroup: '10-12 years', room: 'Room 105', lessonLink: 'https://junior.aliveinjesus.info/' },
  { id: 'c4', name: 'Teen', ageGroup: '13-14 years', room: 'Room 104', lessonLink: 'https://teen.aliveinjesus.info/' },
  { id: 'c5', name: 'Youth', ageGroup: '15-18 years', room: 'Room 201', lessonLink: 'https://youth.aliveinjesus.info/' },
  { id: 'c6', name: 'Adults 1', ageGroup: 'Adults', room: 'Main Sanctuary A', lessonLink: 'https://www.ecolesabbat.org/' },
  { id: 'c7', name: 'Adults 2', ageGroup: 'Adults', room: 'Main Sanctuary B', lessonLink: 'https://www.ecolesabbat.org/' },
  { id: 'c8', name: 'Adults 3', ageGroup: 'Adults', room: 'Fellowship Hall A', lessonLink: 'https://www.ecolesabbat.org/' },
  { id: 'c9', name: 'Adults 4', ageGroup: 'Adults', room: 'Fellowship Hall B', lessonLink: 'https://www.ecolesabbat.org/' },
];

export const initialTeachers: Teacher[] = [
  { id: 'admin-01', name: 'Superintendent', role: 'admin', email: 'admin@philadelphie.org', classIds: [], avatar: 'S' },
];

export const initialStudents: Student[] = [];

export const initialAttendance: AttendanceRecord[] = [];

export const initialOfferings: ClassOffering[] = [];

