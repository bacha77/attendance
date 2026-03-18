import { v4 as uuidv4 } from 'uuid';

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


// 9 Default Classes
export const initialClasses: Class[] = [
  { id: 'c1', name: 'Beginner', ageGroup: '1-3 years old', room: 'Room 101' },
  { id: 'c2', name: 'Kindergarten', ageGroup: '4-6 years old', room: 'Room 102' },
  { id: 'c3', name: 'Primary', ageGroup: '7-9 years old', room: 'Room 103' },
  { id: 'c10', name: 'Junior', ageGroup: '10-12 years', room: 'Room 105' },
  { id: 'c4', name: 'Teen', ageGroup: '13-14 years', room: 'Room 104' },
  { id: 'c5', name: 'Youth', ageGroup: '15-18 years', room: 'Room 201' },
  { id: 'c6', name: 'Adults 1', ageGroup: 'Adults', room: 'Main Sanctuary A' },
  { id: 'c7', name: 'Adults 2', ageGroup: 'Adults', room: 'Main Sanctuary B' },
  { id: 'c8', name: 'Adults 3', ageGroup: 'Adults', room: 'Fellowship Hall A' },
  { id: 'c9', name: 'Adults 4', ageGroup: 'Adults', room: 'Fellowship Hall B' },
];

export const initialTeachers: Teacher[] = [
  { id: 'admin-01', name: 'Admin User', role: 'admin', email: 'admin@philadelphie.org', classIds: [], avatar: 'AD' },
  { id: 't1', name: 'Sarah Jenkins', role: 'teacher', email: 'sarah.j@example.com', classIds: ['c1', 'c2'], avatar: 'SJ' },
  { id: 't2', name: 'Michael Chen', role: 'teacher', email: 'michael.c@example.com', classIds: ['c3', 'c4'], avatar: 'MC' },
  { id: 't3', name: 'Emily Davis', role: 'teacher', email: 'emily.d@example.com', classIds: ['c5'], avatar: 'ED' },
  { id: 't4', name: 'David Wilson', role: 'teacher', email: 'david.w@example.com', classIds: ['c6'], avatar: 'DW' },
  { id: 't5', name: 'Rachel Brown', role: 'teacher', email: 'rachel.b@example.com', classIds: ['c7'], avatar: 'RB' },
  { id: 't6', name: 'James Taylor', role: 'teacher', email: 'james.t@example.com', classIds: ['c8', 'c9'], avatar: 'JT' },
];

export const generateMockStudents = (): Student[] => {
  const students: Student[] = [];
  initialClasses.forEach(cls => {
    // 5 students per class
    for (let i = 1; i <= 5; i++) {
      students.push({
        id: uuidv4(),
        classId: cls.id,
        name: `Student ${i} (${cls.name})`,
        parentEmail: cls.ageGroup === 'Adults' ? undefined : `parent${i}@example.com`,
        parentPhone: cls.ageGroup === 'Adults' ? undefined : `555-010${i}`,
        email: cls.ageGroup === 'Adults' ? `student${i}@example.com` : undefined,
        phone: cls.ageGroup === 'Adults' ? `555-020${i}` : undefined,
        birthdayMonth: Math.floor(Math.random() * 12 + 1).toString(),
        birthdayDay: Math.floor(Math.random() * 28 + 1).toString(),
        avatar: `S${i}`
      });
    }
  });
  return students;
};

export const initialStudents = generateMockStudents();

export const generateMockAttendance = (students: Student[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  // Last 4 Sabbaths
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (i * 7 + (d.getDay() + 1) % 7)); // Get last Sabbaths
    const dateStr = d.toISOString().split('T')[0];

    students.forEach(student => {
      // 85% present rate
      const isPresent = Math.random() > 0.15;
      records.push({
        id: uuidv4(),
        classId: student.classId,
        studentId: student.id,
        date: dateStr,
        status: isPresent ? 'present' : 'absent',
        sevenDaysStudy: isPresent ? Math.random() > 0.5 : false,
        recordedBy: 'system'
      });
    });
  }
  return records;
};

export const initialAttendance = generateMockAttendance(initialStudents);

export const initialOfferings: ClassOffering[] = [];

