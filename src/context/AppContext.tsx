import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { initialClasses, initialTeachers, initialStudents, initialAttendance, initialOfferings } from '../data/mockData';
import type { Class, Teacher, Student, AttendanceRecord, ClassOffering } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

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
    clearAllData: () => void;
    isCloudSyncing: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Check if cloud is configured (not just placeholder)
    const isCloudEnabled = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
    const [isCloudSyncing, setIsCloudSyncing] = useState(false);

    const [classes, setClasses] = useState<Class[]>(() => {
        const saved = localStorage.getItem('ss_classes');
        if (!saved) return initialClasses;
        return JSON.parse(saved);
    });
    
    const [teachers, setTeachers] = useState<Teacher[]>(() => {
        const saved = localStorage.getItem('ss_teachers');
        if (!saved) return initialTeachers;
        return JSON.parse(saved);
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
        const saved = localStorage.getItem('ss_churchName');
        return (saved && saved !== 'PHILADELPHIE SDA CHURCH') ? saved : 'PHILADELPHIE SEVENTH DAY ADVENTIST CHURCH';
    });

    const [churchLogo, setChurchLogo] = useState(() => {
        return localStorage.getItem('ss_churchLogo') || '';
    });

    // --- CLOUD SYNC LOGIC ---

    const fetchAllData = useCallback(async () => {
        if (!isCloudEnabled) return;
        setIsCloudSyncing(true);
        try {
            const [
                { data: cls },
                { data: std },
                { data: att },
                { data: off }
            ] = await Promise.all([
                supabase.from('classes').select('*'),
                supabase.from('students').select('*'),
                supabase.from('attendance').select('*'),
                supabase.from('offerings').select('*')
            ]);

            if (cls) setClasses(cls);
            if (std) setStudents(std);
            if (att) {
                // Map DB names to CamelCase
                const mappedAtt = att.map((a: any) => ({
                    ...a,
                    sevenDaysStudy: a.seven_days_study,
                    recordedBy: a.recorded_by
                }));
                setAttendance(mappedAtt);
            }
            if (off) setOfferings(off);
        } catch (error) {
            console.error('Initial fetch failed:', error);
        } finally {
            setIsCloudSyncing(false);
        }
    }, [isCloudEnabled]);

    // Initial load and Real-time Subscription
    useEffect(() => {
        if (!isCloudEnabled) return;
        fetchAllData();

        // Subscribe to changes
        const studentSub = supabase
            .channel('public:students')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, fetchAllData)
            .subscribe();

        const attSub = supabase
            .channel('public:attendance')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, fetchAllData)
            .subscribe();

        const offSub = supabase
            .channel('public:offerings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'offerings' }, fetchAllData)
            .subscribe();

        return () => {
            supabase.removeChannel(studentSub);
            supabase.removeChannel(attSub);
            supabase.removeChannel(offSub);
        };
    }, [isCloudEnabled, fetchAllData]);

    // Save to LocalStorage
    useEffect(() => { localStorage.setItem('ss_classes', JSON.stringify(classes)); }, [classes]);
    useEffect(() => { localStorage.setItem('ss_teachers', JSON.stringify(teachers)); }, [teachers]);
    useEffect(() => { localStorage.setItem('ss_students', JSON.stringify(students)); }, [students]);
    useEffect(() => { localStorage.setItem('ss_attendance', JSON.stringify(attendance)); }, [attendance]);
    useEffect(() => { localStorage.setItem('ss_offerings', JSON.stringify(offerings)); }, [offerings]);
    useEffect(() => { localStorage.setItem('ss_emails', JSON.stringify(extraEmails)); }, [extraEmails]);
    useEffect(() => { localStorage.setItem('ss_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
    useEffect(() => { localStorage.setItem('ss_churchName', churchName); }, [churchName]);
    useEffect(() => { localStorage.setItem('ss_churchLogo', churchLogo); }, [churchLogo]);

    // --- ACTIONS ---

    const addClass = async (cls: Omit<Class, 'id'>) => {
        const newClass = { ...cls, id: uuidv4() };
        setClasses([...classes, newClass]);
        if (isCloudEnabled) {
            await supabase.from('classes').insert([newClass]);
        }
    };

    const updateClass = async (id: string, updated: Partial<Class>) => {
        setClasses(classes.map(c => c.id === id ? { ...c, ...updated } : c));
        if (isCloudEnabled) {
            await supabase.from('classes').update(updated).eq('id', id);
        }
    };

    const removeClass = async (id: string) => {
        if (window.confirm('Delete this class?')) {
            setClasses(classes.filter(c => c.id !== id));
            if (isCloudEnabled) {
                await supabase.from('classes').delete().eq('id', id);
            }
        }
    };

    const recordAttendance = async (
        classId: string,
        date: string,
        newRecords: { studentId: string, status: 'present' | 'absent', sevenDaysStudy: boolean }[],
        recordedBy: string
    ) => {
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

        if (isCloudEnabled) {
            // Delete old cloud records for this day/class
            await supabase.from('attendance').delete().eq('class_id', classId).eq('date', date);
            // Insert new ones
            const dbRecords = formattedRecords.map(r => ({
                id: r.id,
                class_id: r.classId,
                date: r.date,
                student_id: r.studentId,
                status: r.status,
                seven_days_study: r.sevenDaysStudy,
                recorded_by: r.recordedBy
            }));
            await supabase.from('attendance').insert(dbRecords);
        }
    };

    const recordOffering = async (classId: string, date: string, amount: number) => {
        const newOffering = { id: uuidv4(), classId, date, amount };
        const filtered = offerings.filter(o => !(o.classId === classId && o.date === date));
        setOfferings([...filtered, newOffering]);

        if (isCloudEnabled) {
            await supabase.from('offerings').delete().eq('class_id', classId).eq('date', date);
            await supabase.from('offerings').insert([{
                id: newOffering.id,
                class_id: newOffering.classId,
                date: newOffering.date,
                amount: newOffering.amount
            }]);
        }
    };

    const addStudent = async (student: Omit<Student, 'id'>) => {
        const newStudent = { ...student, id: uuidv4() };
        setStudents([...students, newStudent]);
        if (isCloudEnabled) {
            const dbStudent = {
                id: newStudent.id,
                name: newStudent.name,
                class_id: newStudent.classId,
                parent_email: newStudent.parentEmail,
                parent_phone: newStudent.parentPhone,
                birthday_month: newStudent.birthdayMonth,
                birthday_day: newStudent.birthdayDay,
                avatar: newStudent.avatar
            };
            await supabase.from('students').insert([dbStudent]);
        }
    };

    const updateStudent = async (id: string, updated: Partial<Student>) => {
        setStudents(students.map(s => s.id === id ? { ...s, ...updated } : s));
        if (isCloudEnabled) {
            const dbUpdate: any = {};
            if (updated.name) dbUpdate.name = updated.name;
            if (updated.classId) dbUpdate.class_id = updated.classId;
            if (updated.parentEmail) dbUpdate.parent_email = updated.parentEmail;
            if (updated.parentPhone) dbUpdate.parent_phone = updated.parentPhone;
            await supabase.from('students').update(dbUpdate).eq('id', id);
        }
    };

    const removeStudent = async (id: string) => {
        if (window.confirm('Remove this student?')) {
            setStudents(students.filter(s => s.id !== id));
            if (isCloudEnabled) {
                await supabase.from('students').delete().eq('id', id);
            }
        }
    };

    const addTeacher = (teacher: Omit<Teacher, 'id' | 'classIds'>) => {
        setTeachers([...teachers, { ...teacher, id: uuidv4(), classIds: [], avatar: teacher.name.charAt(0) }]);
    };

    const updateTeacher = (id: string, updated: Partial<Teacher>) => {
        setTeachers(teachers.map(t => t.id === id ? { ...t, ...updated } : t));
    };

    const removeTeacher = (id: string) => {
        if (window.confirm('Remove this teacher?')) {
            setTeachers(teachers.filter(t => t.id !== id));
        }
    };

    const updateExtraEmails = (emails: string[]) => setExtraEmails(emails);
    
    const updateChurchSettings = (name: string, logo: string) => {
        setChurchName(name);
        setChurchLogo(logo);
    };

    const assignTeacher = (teacherId: string, classId: string) => {
        setTeachers(teachers.map(t => t.id === teacherId ? { ...t, classIds: [...t.classIds, classId] } : t));
    };

    const unassignTeacher = (teacherId: string, classId: string) => {
        setTeachers(teachers.map(t => t.id === teacherId ? { ...t, classIds: t.classIds.filter(id => id !== classId) } : t));
    };

    const clearAllData = () => {
        if (window.confirm('Clear ALL data?')) {
            setStudents([]);
            setAttendance([]);
            setOfferings([]);
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <AppContext.Provider value={{
            classes, teachers, students, attendance, offerings, extraEmails,
            addClass, updateClass, removeClass, assignTeacher, unassignTeacher, recordAttendance, recordOffering,
            addStudent, updateStudent, removeStudent,
            addTeacher, updateTeacher, removeTeacher, updateExtraEmails,
            currentUser, setCurrentUser,
            churchName, churchLogo, updateChurchSettings, clearAllData,
            isCloudSyncing
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
