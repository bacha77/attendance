import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Clock, Calendar, Search, ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Attendance: React.FC = () => {
    const { classes, students, recordAttendance } = useAppContext();

    const { classId } = useParams<{ classId: string }>();
    const navigate = useNavigate();

    const [selectedClassId, setSelectedClassId] = useState(classId || classes[0]?.id || '');

    useEffect(() => {
        if (classId) {
            setSelectedClassId(classId);
        }
    }, [classId]);
    const [date, setDate] = useState(() => {
        const d = new Date();
        const day = d.getDay();
        const offset = (day + 1) % 7;
        d.setDate(d.getDate() - (offset === 0 ? 0 : offset)); // Go back to last Saturday or stay if today is Saturday
        return d.toISOString().split('T')[0];
    });

    const [attendanceState, setAttendanceState] = useState<{ [key: string]: { status: 'present' | 'absent', sevenDaysStudy: boolean } }>({});
    const [searchTerm, setSearchTerm] = useState('');

    const classStudents = useMemo(() => {
        return students.filter(s => s.classId === selectedClassId)
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [students, selectedClassId, searchTerm]);

    // Calculate metrics for the graphical header
    const metrics = React.useMemo(() => {
        const total = classStudents.length;
        const present = Object.values(attendanceState).filter(s => s.status === 'present').length;
        const study = Object.values(attendanceState).filter(s => s.sevenDaysStudy).length;
        const percent = total > 0 ? Math.round((present / total) * 100) : 0;
        return { total, present, study, percent };
    }, [classStudents, attendanceState]);

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
            <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {classId && (
                    <button className="btn-icon" onClick={() => navigate(-1)} style={{ width: '42px', height: '42px', backgroundColor: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                        {classId ? classes.find(c => c.id === selectedClassId)?.name : 'Attendance'} <span style={{ color: 'var(--primary-color)' }}>Entry</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{classId ? `Logging attendance for ${classes.find(c => c.id === selectedClassId)?.name} class.` : "Select a class to begin logging Sabbath School attendance."}</p>
                </div>
            </div>

            {!classId && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '1.25rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>Select Class</label>
                        <select
                            className="form-control"
                            value={selectedClassId}
                            onChange={e => setSelectedClassId(e.target.value)}
                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '0.75rem 1rem' }}
                        >
                            {classes.map(c => (
                                <option key={c.id} value={c.id} style={{ backgroundColor: '#0f172a' }}>{c.name} ({c.room})</option>
                            ))}
                        </select>
                    </div>

                    <div className="card" style={{ padding: '1.25rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={14} /> Recording Date
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={e => {
                                const d = new Date(e.target.value);
                                if (d.getUTCDay() !== 6) {
                                    alert('Please select a Sabbath (Saturday).');
                                    return;
                                }
                                setDate(e.target.value);
                            }}
                            max={new Date().toISOString().split('T')[0]}
                            style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '0.75rem 1rem' }}
                        />
                        <small style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '0.5rem', display: 'block' }}>Only Saturdays are valid for records</small>
                    </div>
                </div>
            )}

            {selectedClassId && (
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-color)', borderRadius: '10px', color: 'white' }}>
                                    <Users size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>Attendance Registry</h3>
                                <span className="badge badge-primary">{classes.find(c => c.id === selectedClassId)?.room}</span>
                            </div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Record Sabbath school participation and lesson study progress.</p>
                        </div>

                        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Present</p>
                                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--success-color)' }}>{metrics.present} <span style={{ fontSize: '1rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ {metrics.total}</span></p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>7-Day Study</p>
                                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-color)' }}>{metrics.study}</p>
                            </div>
                            <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(var(--success-color) ${metrics.percent}%, rgba(255,255,255,0.05) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>
                                    {metrics.percent}%
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Background Graphic */}
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05 }}>
                        <Users size={180} />
                    </div>
                </div>
            )}

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
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(30, 41, 59, 0.2)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                        <div style={{ marginBottom: '1rem', opacity: 0.5 }}><Users size={48} /></div>
                        No students enrolled in this class yet.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {classStudents.map(student => {
                            const state = attendanceState[student.id] || { status: 'present', sevenDaysStudy: false };
                            const status = state.status;
                            const isSevenDays = state.sevenDaysStudy;
                            return (
                                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'rgba(30, 41, 59, 0.25)', borderRadius: '20px', border: '1px solid var(--border-color)', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '200px' }}>
                                        <div className="avatar" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', fontSize: '1rem', fontWeight: 700, border: '1px solid rgba(99, 102, 241, 0.2)' }}>{student.avatar}</div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>{student.name}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>Student ID: {student.id.split('-')[0]}</span>
                                                {isSevenDays && <span style={{ fontSize: '0.65rem', color: 'var(--success-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={10} /> 7 Days Study Complete</span>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                                            <button
                                                onClick={() => toggleStatus(student.id, 'present')}
                                                style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer', backgroundColor: status === 'present' ? 'var(--success-color)' : 'transparent', color: status === 'present' ? 'white' : 'var(--text-dim)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <CheckCircle size={14} /> Present
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(student.id, 'absent')}
                                                style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, border: 'none', cursor: 'pointer', backgroundColor: status === 'absent' ? 'var(--danger-color)' : 'transparent', color: status === 'absent' ? 'white' : 'var(--text-dim)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <XCircle size={14} /> Absent
                                            </button>
                                        </div>
                                        
                                        <button
                                            onClick={() => toggleStatus(student.id, '7_days_study')}
                                            disabled={status === 'absent'}
                                            style={{ padding: '0.6rem 1rem', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid', borderColor: isSevenDays ? 'var(--primary-color)' : 'var(--border-color)', cursor: status === 'absent' ? 'not-allowed' : 'pointer', backgroundColor: isSevenDays ? 'var(--primary-glow)' : 'rgba(15, 23, 42, 0.4)', color: isSevenDays ? 'white' : 'var(--text-dim)', opacity: status === 'absent' ? 0.3 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Clock size={16} /> <span style={{ display: 'none' }}>Study</span> 7 Days
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
