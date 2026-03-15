import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Clock, Calendar, Search } from 'lucide-react';

const Attendance: React.FC = () => {
    const { classes, students, recordAttendance } = useAppContext();

    const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
    const [date, setDate] = useState(() => {
        const d = new Date();
        const day = d.getDay();
        const offset = (day + 1) % 7; 
        d.setDate(d.getDate() - offset);
        return d.toISOString().split('T')[0];
    });
    const [attendanceState, setAttendanceState] = useState<{ [key: string]: { status: 'present' | 'absent', sevenDaysStudy: boolean } }>({});
    const [searchTerm, setSearchTerm] = useState('');

    const classStudents = useMemo(() => {
        return students.filter(s => s.classId === selectedClassId)
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [students, selectedClassId, searchTerm]);

    // Init attendance state when class changes
    React.useEffect(() => {
        const newState: any = {};
        classStudents.forEach(s => {
            // default present for fast entry
            newState[s.id] = { status: 'present', sevenDaysStudy: false };
        });
        setAttendanceState(newState);
    }, [selectedClassId, classStudents.length, classStudents[0]?.classId, date]);

    const toggleStatus = (studentId: string, type: 'present' | 'absent' | '7_days_study') => {
        setAttendanceState(prev => {
            const current = prev[studentId] || { status: 'absent', sevenDaysStudy: false };
            if (type === 'present') {
                return { ...prev, [studentId]: { status: 'present', sevenDaysStudy: current.sevenDaysStudy } };
            } else if (type === 'absent') {
                return { ...prev, [studentId]: { status: 'absent', sevenDaysStudy: false } };
            } else if (type === '7_days_study') {
                // Force present if they check 7 Days Study
                return { ...prev, [studentId]: { status: 'present', sevenDaysStudy: !current.sevenDaysStudy } };
            }
            return prev;
        });
    };

    const markAll = (status: 'present' | 'absent') => {
        const newState: any = {};
        classStudents.forEach(s => {
            newState[s.id] = { status, sevenDaysStudy: false };
        });
        setAttendanceState(newState);
    };

    const handleSave = () => {
        const records = Object.keys(attendanceState).map(studentId => ({
            studentId,
            status: attendanceState[studentId].status,
            sevenDaysStudy: attendanceState[studentId].sevenDaysStudy
        }));
        recordAttendance(selectedClassId, date, records, 'admin');
        alert('Attendance saved successfully!');
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Fast Attendance Entry</h2>
                <p style={{ color: 'var(--text-muted)' }}>Quickly log today's attendance for your Sabbath school class.</p>
            </div>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                    <label className="form-label">Select Class</label>
                    <select
                        className="form-control"
                        value={selectedClassId}
                        onChange={e => setSelectedClassId(e.target.value)}
                        style={{ appearance: 'none', backgroundColor: 'var(--bg-color)' }}
                    >
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({c.ageGroup})</option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                    <label className="form-label" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Calendar size={16} /> Date
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={e => {
                            // Ensure only Saturdays can be selected
                            const d = new Date(e.target.value);
                            const day = d.getUTCDay();
                            if (day !== 6) {
                                alert('Please select a Sabbath (Saturday) for attendance records.');
                                return;
                            }
                            setDate(e.target.value);
                        }}
                        max={new Date().toISOString().split('T')[0]} // up to today
                        style={{ cursor: 'pointer' }}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>Only Saturdays are allowed</small>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student List</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search student..."
                                style={{ paddingLeft: '2rem', width: '200px', padding: '0.5rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-secondary" onClick={() => markAll('present')} style={{ padding: '0.5rem 1rem' }}>Mark All Present</button>
                        <button className="btn btn-secondary" onClick={() => markAll('absent')} style={{ padding: '0.5rem 1rem' }}>Mark All Absent</button>
                    </div>
                </div>

                {classStudents.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                        No students enrolled in this class yet.
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th style={{ textAlign: 'center', width: '300px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classStudents.map(student => {
                                    const state = attendanceState[student.id] || { status: 'present', sevenDaysStudy: false };
                                    const status = state.status;
                                    const isSevenDays = state.sevenDaysStudy;
                                    return (
                                        <tr key={student.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div className="avatar avatar-sm">{student.avatar}</div>
                                                <span style={{ fontWeight: 500, fontSize: '1rem' }}>{student.name}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button
                                                        className={`btn ${status === 'present' ? 'btn-success' : 'btn-secondary'}`}
                                                        onClick={() => toggleStatus(student.id, 'present')}
                                                        style={{ minWidth: '100px', display: 'flex', gap: '0.5rem' }}
                                                    >
                                                        <CheckCircle size={16} /> Present
                                                    </button>
                                                    <button
                                                        className={`btn ${status === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                                                        onClick={() => toggleStatus(student.id, 'absent')}
                                                        style={{ minWidth: '100px', display: 'flex', gap: '0.5rem' }}
                                                    >
                                                        <XCircle size={16} /> Absent
                                                    </button>
                                                    <button
                                                        className={`btn ${isSevenDays ? 'btn-primary' : 'btn-secondary'}`}
                                                        onClick={() => toggleStatus(student.id, '7_days_study')}
                                                        style={{ minWidth: '160px', display: 'flex', gap: '0.5rem', whiteSpace: 'nowrap', opacity: status === 'absent' ? 0.5 : 1 }}
                                                        disabled={status === 'absent'}
                                                    >
                                                        <Clock size={16} /> 7 Days Study
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleSave} style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600 }}>
                        Submit Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
