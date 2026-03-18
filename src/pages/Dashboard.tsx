import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserX, UserCheck, TrendingUp, BookOpen, Clock, Gift, MessageSquare, ChevronRight, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
    const { classes, students, attendance, extraEmails, teachers, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [selectedTeacherId, setSelectedTeacherId] = React.useState('admin-01');

    // Get classes for the selected teacher
    const teacherClasses = React.useMemo(() => {
        if (selectedTeacherId === 'admin-01') return classes;
        const teacher = teachers.find(t => t.id === selectedTeacherId);
        return classes.filter(c => teacher?.classIds.includes(c.id));
    }, [selectedTeacherId, teachers, classes]);

    // Calculate students requiring a visit (absent last 2 recorded Sabbaths)
    const studentsNeedingVisit = React.useMemo(() => {
        const needsVisit: any[] = [];
        students.forEach(student => {
            const studentRecords = attendance
                .filter(a => a.studentId === student.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            if (studentRecords.length >= 2) {
                if (studentRecords[0].status === 'absent' && studentRecords[1].status === 'absent') {
                    needsVisit.push(student);
                }
            }
        });
        return needsVisit;
    }, [students, attendance]);

    // Check for Birthdays this month
    const upcomingBirthdays = React.useMemo(() => {
        const currentMonth = (new Date().getMonth() + 1).toString();
        return students.filter(s => s.birthdayMonth === currentMonth);
    }, [students]);

    // Quick Stats Calculation
    const totalStudents = students.length;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(45deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Welcome back, {currentUser?.name || teachers.find(t => t.id === selectedTeacherId)?.name || 'Organizer'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Here's what's happening at Sabbath School today.</p>
                </div>

                <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Switch Teacher View:</label>
                    <select
                        className="form-control"
                        style={{ padding: '0.4rem 2rem 0.4rem 1rem', width: 'auto', fontSize: '0.875rem' }}
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(e.target.value)}
                    >
                        <option value="admin-01">Administrative View (All Classes)</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid-stats">
                <div className="card stat-card interactive-card" onClick={() => navigate('/classes')}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Enrolled</h3>
                        <p>{totalStudents}</p>
                    </div>
                    <ChevronRight size={16} className="card-arrow" />
                </div>

                <div className="card stat-card interactive-card" onClick={() => navigate('/attendance')}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                        <UserCheck size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Entry Status</h3>
                        <p>Avg ~85%</p>
                    </div>
                    <ChevronRight size={16} className="card-arrow" />
                </div>

                <div className="card stat-card interactive-card" onClick={() => navigate('/reports')}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
                        <UserX size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Visit Alerts</h3>
                        <p>{studentsNeedingVisit.length}</p>
                    </div>
                    <ChevronRight size={16} className="card-arrow" />
                </div>

                <div className="card stat-card interactive-card" onClick={() => navigate('/teachers')}>
                    <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Our Teachers</h3>
                        <p>{teachers.length}</p>
                    </div>
                    <ChevronRight size={16} className="card-arrow" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card interactive-card" onClick={() => navigate('/reports')}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={20} color="var(--primary-color)" /> Classes Overview
                    </h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Class Name</th>
                                    <th>Enrolled</th>
                                    <th>Room</th>
                                    <th>Resource</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.slice(0, 5).map(c => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                                        <td>{students.filter(s => s.classId === c.id).length}</td>
                                        <td>
                                            <span className="badge badge-primary">{c.room}</span>
                                        </td>
                                        <td>
                                            {c.lessonLink ? (
                                                <a href={c.lessonLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                                                    <ExternalLink size={12} /> Lesson
                                                </a>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ChevronRight size={16} className="card-arrow" />
                </div>

                <div className="card interactive-card" onClick={() => navigate('/attendance')}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} color="var(--primary-color)" /> My Assigned Classes
                    </h3>
                    {teacherClasses.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                            No classes assigned to this teacher.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                            {teacherClasses.map(c => (
                                <div key={c.id} style={{ padding: '1.25rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', color: 'white' }}>
                                            <BookOpen size={20} />
                                        </div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{c.name}</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.room}</p>
                                    </div>

                                    {c.lessonLink && (
                                        <a
                                            href={c.lessonLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{ marginTop: '1rem', fontSize: '0.7rem', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid rgba(99, 102, 241, 0.3)', color: 'var(--primary-color)' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={12} /> Get Lesson
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <ChevronRight size={16} className="card-arrow" />
                </div>

                <div className="card interactive-card" onClick={() => navigate('/messaging')}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <MessageSquare size={20} /> Report Distribution Box
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Weekly reports are currently shared with:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {extraEmails.map((email, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#e2e8f0' }}>{email}</span>
                                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600, textTransform: 'uppercase' }}>{email.includes('pastor') ? 'Pastor' : email.includes('clerk') ? 'Clerk' : 'Recipient'}</span>
                            </div>
                        ))}
                        {extraEmails.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No recipients on the board.</p>}
                    </div>
                    <ChevronRight size={16} className="card-arrow" />
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} color="var(--success-color)" /> Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                            <div className="avatar avatar-sm">SJ</div>
                            <div>
                                <p style={{ fontSize: '0.875rem' }}><strong style={{ color: 'white' }}>Sarah Jenkins</strong> submitted attendance for <strong style={{ color: 'white' }}>Nursery</strong></p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>10 mins ago</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                            <div className="avatar avatar-sm">MC</div>
                            <div>
                                <p style={{ fontSize: '0.875rem' }}><strong style={{ color: 'white' }}>Michael Chen</strong> submitted attendance for <strong style={{ color: 'white' }}>Toddlers</strong></p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>15 mins ago</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                            <div className="avatar avatar-sm">SYS</div>
                            <div>
                                <p style={{ fontSize: '0.875rem' }}><strong style={{ color: 'white' }}>System</strong> generated weekly report</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 hour ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6' }}>
                        <Gift size={20} /> Upcoming Birthdays
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Students with Birthdays this month:
                    </p>
                    {upcomingBirthdays.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                            No birthdays this month.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {upcomingBirthdays.slice(0, 5).map(s => {
                                const cls = classes.find(c => c.id === s.classId);
                                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                const monthName = s.birthdayMonth ? months[parseInt(s.birthdayMonth) - 1] : "";
                                return (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #8b5cf6' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className="avatar avatar-sm">{s.avatar}</div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{s.name}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{monthName} {s.birthdayDay} | {cls?.name}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => alert(`Sending Birthday congrats to ${s.name}!`)}>
                                            Say Happy B-Day
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)' }}>
                        <UserX size={20} /> Action Required: Visit Needed
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        The following students have missed 2 consecutive Sabbaths:
                    </p>
                    {studentsNeedingVisit.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                            No students need visits right now.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {studentsNeedingVisit.slice(0, 5).map(s => {
                                const cls = classes.find(c => c.id === s.classId);
                                return (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--danger-color)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className="avatar avatar-sm">{s.avatar}</div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{s.name}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class: {cls?.name}</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'flex', gap: '0.25rem' }} onClick={() => alert(`Sending follow-up Email to ${s.name}'s contact...`)}>
                                            <MessageSquare size={12} /> Send Email
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
