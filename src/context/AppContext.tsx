import React, { createContext, useContext, useState, useEffect } from 'react';
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
    addTeacher: (teacher: Omit<Teacher, 'id' | 'classIds'>) => void;
    updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
    removeTeacher: (id: string) => void;
    updateExtraEmails: (emails: string[]) => void;
    currentUser: Teacher | null;
    setCurrentUser: (user: Teacher | null) => void;
    churchName: string;
    churchLogo: string;
    updateChurchSettings: (name: string, logo: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [classes, setClasses] = useState<Class[]>(() => {
        const saved = localStorage.getItem('ss_classes');
        if (!saved) return initialClasses;
        const parsed: Class[] = JSON.parse(saved);
        // Auto-upgrade: Merge lessonLink from initialClasses if it's new or the old one needs updating
        return parsed.map(c => {
            const initial = initialClasses.find(ic => ic.id === c.id);
            if (initial && initial.lessonLink) {
                // If the link is missing OR if it's an adult class (c6-c9) using the old link, update it
                if (!c.lessonLink || (c.id.startsWith('c6') || c.id.startsWith('c7') || c.id.startsWith('c8') || c.id.startsWith('c9'))) {
                    return { ...c, lessonLink: initial.lessonLink };
                }
            }
            return c;
        });
    });
    const [teachers, setTeachers] = useState<Teacher[]>(() => {
        const saved = localStorage.getItem('ss_teachers');
        if (!saved) return initialTeachers;
        const parsed = JSON.parse(saved);
        // Ensure initial teachers (like admin) have correct roles even if saved older version
        return parsed.map((t: Teacher) => {
            const initial = initialTeachers.find(it => it.id === t.id);
            if (initial && initial.role !== t.role) return { ...t, role: initial.role };
            return t;
        });
    });
    const [students, setStudents] = useState<Student[]>(() => {
        const saved = localStorage.getItem('ss_students');
        return saved ? JSON.parse(saved) : initialStudents;
    });
    const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
        const saved = localStorage.getItem('ss_attendance');
        return saved ? JSON.parse(saved) : initialAttendance;
    });
    const [offerings, setOfferings] = useState<ClassOffering[]>(() => {
        const saved = localStorage.getItem('ss_offerings');
        return saved ? JSON.parse(saved) : initialOfferings;
    });
    const [extraEmails, setExtraEmails] = useState<string[]>(() => {
        const saved = localStorage.getItem('ss_emails');
        return saved ? JSON.parse(saved) : ['pastor@philadelphie.org', 'clerk@philadelphie.org'];
    });
    const [currentUser, setCurrentUser] = useState<Teacher | null>(() => {
        const saved = localStorage.getItem('ss_currentUser');
        return saved ? JSON.parse(saved) : initialTeachers[0];
    });
    const [churchName, setChurchName] = useState(() => {
        return localStorage.getItem('ss_churchName') || 'PHILADELPHIE SDA CHURCH';
    });
    const [churchLogo, setChurchLogo] = useState(() => {
        return localStorage.getItem('ss_churchLogo') || '';
    });

    // Persistence Effects
    useEffect(() => localStorage.setItem('ss_classes', JSON.stringify(classes)), [classes]);
    useEffect(() => localStorage.setItem('ss_teachers', JSON.stringify(teachers)), [teachers]);
    useEffect(() => localStorage.setItem('ss_students', JSON.stringify(students)), [students]);
    useEffect(() => localStorage.setItem('ss_attendance', JSON.stringify(attendance)), [attendance]);
    useEffect(() => localStorage.setItem('ss_offerings', JSON.stringify(offerings)), [offerings]);
    useEffect(() => localStorage.setItem('ss_emails', JSON.stringify(extraEmails)), [extraEmails]);
    useEffect(() => localStorage.setItem('ss_currentUser', JSON.stringify(currentUser)), [currentUser]);
    useEffect(() => localStorage.setItem('ss_churchName', churchName), [churchName]);
    useEffect(() => localStorage.setItem('ss_churchLogo', churchLogo), [churchLogo]);

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

    const addTeacher = (teacher: Omit<Teacher, 'id' | 'classIds'>) => {
        setTeachers([...teachers, {
            ...teacher,
            id: uuidv4(),
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

    const updateChurchSettings = (name: string, logo: string) => {
        setChurchName(name);
        setChurchLogo(logo);
    };

    return (
        <AppContext.Provider value={{
            classes, teachers, students, attendance, offerings, extraEmails,
            addClass, updateClass, removeClass, assignTeacher, unassignTeacher, recordAttendance, recordOffering,
            addStudent, updateStudent, removeStudent,
            addTeacher, updateTeacher, removeTeacher, updateExtraEmails,
            currentUser, setCurrentUser,
            churchName, churchLogo, updateChurchSettings
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
