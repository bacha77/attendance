import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { initialClasses, initialTeachers, initialStudents, initialAttendance, initialOfferings } from '../data/mockData';
import type { Class, Teacher, Student, AttendanceRecord, ClassOffering } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    classes: Class[];
    teachers: Teacher[];
    students: Student[];
    attendance: AttendanceRecord[];
    offerings: ClassOffering[];
    extraEmails: string[];
    addClass: (cls: Omit<Class, 'id'>) => void;
    updateClass: (id: string, cls: Partial<Class>) => void;
    removeClass: (id: string) => void;
    assignTeacher: (teacherId: string, classId: string) => void;
    unassignTeacher: (teacherId: string, classId: string) => void;
    recordAttendance: (classId: string, date: string, records: { studentId: string, status: 'present' | 'absent', sevenDaysStudy: boolean }[], recordedBy: string) => void;
    recordOffering: (classId: string, date: string, amount: number) => void;
    addStudent: (student: Omit<Student, 'id'>) => void;
    updateStudent: (id: string, student: Partial<Student>) => void;
    removeStudent: (id: string) => void;
    addTeacher: (teacher: Omit<Teacher, 'id' | 'role' | 'classIds'>) => void;
    updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
    removeTeacher: (id: string) => void;
    updateExtraEmails: (emails: string[]) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [classes, setClasses] = useState<Class[]>(initialClasses);
    const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
    const [offerings, setOfferings] = useState<ClassOffering[]>(initialOfferings);
    const [extraEmails, setExtraEmails] = useState<string[]>(['pastor@philadelphie.org', 'clerk@philadelphie.org']);

    const addClass = (cls: Omit<Class, 'id'>) => {
        setClasses([...classes, { ...cls, id: uuidv4() }]);
    };

    const updateClass = (id: string, updated: Partial<Class>) => {
        setClasses(classes.map(c => c.id === id ? { ...c, ...updated } : c));
    };

    const removeClass = (id: string) => {
        if (window.confirm('Are you sure you want to delete this class? All students in this class will be unassigned.')) {
            setClasses(classes.filter(c => c.id !== id));
            setStudents(students.map(s => s.classId === id ? { ...s, classId: '' } : s));
        }
    };

    const assignTeacher = (teacherId: string, classId: string) => {
        setTeachers(teachers.map(t => {
            if (t.id === teacherId) {
                if (!t.classIds.includes(classId)) {
                    return { ...t, classIds: [...t.classIds, classId] };
                }
            }
            return t;
        }));
    };

    const unassignTeacher = (teacherId: string, classId: string) => {
        setTeachers(teachers.map(t => {
            if (t.id === teacherId) {
                return { ...t, classIds: t.classIds.filter(id => id !== classId) };
            }
            return t;
        }));
    };

    const recordAttendance = (
        classId: string,
        date: string,
        newRecords: { studentId: string, status: 'present' | 'absent', sevenDaysStudy: boolean }[],
        recordedBy: string
    ) => {
        // Remove old records for this class on this date to replace
        const filtered = attendance.filter(a => !(a.classId === classId && a.date === date));

        const formattedRecords: AttendanceRecord[] = newRecords.map(r => ({
            id: uuidv4(),
            classId,
            date,
            studentId: r.studentId,
            status: r.status,
            sevenDaysStudy: r.sevenDaysStudy,
            recordedBy
        }));

        setAttendance([...filtered, ...formattedRecords]);
    };

    const recordOffering = (classId: string, date: string, amount: number) => {
        const filtered = offerings.filter(o => !(o.classId === classId && o.date === date));
        setOfferings([...filtered, { id: uuidv4(), classId, date, amount }]);
    };

    const addStudent = (student: Omit<Student, 'id'>) => {
        setStudents([...students, { ...student, id: uuidv4() }]);
    };

    const updateStudent = (id: string, updated: Partial<Student>) => {
        setStudents(students.map(s => s.id === id ? { ...s, ...updated } : s));
    };

    const removeStudent = (id: string) => {
        if (window.confirm('Are you sure you want to remove this student? All their attendance records will also be deleted.')) {
            setStudents(students.filter(s => s.id !== id));
            setAttendance(attendance.filter(a => a.studentId !== id));
        }
    };

    const addTeacher = (teacher: Omit<Teacher, 'id' | 'role' | 'classIds'>) => {
        setTeachers([...teachers, {
            ...teacher,
            id: uuidv4(),
            role: 'teacher',
            classIds: [],
            avatar: teacher.name.charAt(0).toUpperCase()
        }]);
    };

    const updateTeacher = (id: string, updated: Partial<Teacher>) => {
        setTeachers(teachers.map(t => t.id === id ? { ...t, ...updated } : t));
    };

    const removeTeacher = (id: string) => {
        if (window.confirm('Are you sure you want to remove this teacher?')) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };

    const updateExtraEmails = (emails: string[]) => {
        setExtraEmails(emails);
    };

    return (
        <AppContext.Provider value={{
            classes, teachers, students, attendance, offerings, extraEmails,
            addClass, updateClass, removeClass, assignTeacher, unassignTeacher, recordAttendance, recordOffering,
            addStudent, updateStudent, removeStudent,
            addTeacher, updateTeacher, removeTeacher, updateExtraEmails
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
