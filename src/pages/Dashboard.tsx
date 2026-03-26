import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserX, UserCheck, TrendingUp, BookOpen, Clock, Gift, MessageSquare, ChevronRight, ExternalLink, Globe, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell
} from 'recharts';

const Dashboard: React.FC = () => {
    const { classes, students, attendance, extraEmails, teachers, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [selectedTeacherId] = React.useState('admin-01');

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

    // Calculate Attendance Trend Data (Last 5 Sabbaths)
    const attendanceTrend = React.useMemo(() => {
        const dates = [...new Set(attendance.map(a => a.date))].sort().slice(-5);
        if (dates.length === 0) {
            // Placeholder data for visual appeal if no records yet
            return [
                { date: 'Sabbath 1', count: 45 },
                { date: 'Sabbath 2', count: 52 },
                { date: 'Sabbath 3', count: 38 },
                { date: 'Sabbath 4', count: 61 },
                { date: 'Today', count: 58 },
            ];
        }
        return dates.map(date => ({
            date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
            count: attendance.filter(a => a.date === date && a.status === 'present').length
        }));
    }, [attendance]);

    // Calculate Class Distribution Data
    const classDistData = React.useMemo(() => {
        return classes.map((c, idx) => ({
            name: c.name,
            value: students.filter(s => s.classId === c.id).length,
            color: `hsl(${220 + (idx * 20)}, 70%, 60%)`
        })).filter(d => d.value > 0);
    }, [classes, students]);

    return (
        <div className="animate-fade-in">
            <div style={{ position: 'relative', height: '220px', borderRadius: '24px', overflow: 'hidden', marginBottom: '2.5rem', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <img 
                    src="/sabbath_school_banner_1774481468531.png" 
                    alt="Sabbath School" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2, 6, 23, 0.95), transparent)', display: 'flex', alignItems: 'center', padding: '0 3rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-color)', marginBottom: '0.75rem' }}>
                            <LayoutDashboard size={20} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Analytics Dashboard</span>
                        </div>
                        <h2 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.03em' }}>
                            Welcome, <span style={{ color: 'var(--primary-color)' }}>{currentUser?.name || 'Organizer'}</span>
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Philadelphie SDA Church • Sabbath School System</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', borderRadius: '99px', border: '1px solid rgba(99, 102, 241, 0.3)', backdropFilter: 'blur(8px)' }}>
                                <div className="status-dot" style={{ width: '8px', height: '8px' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Live Session</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card stat-card interactive-card" onClick={() => navigate('/classes')} style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Enrollment</h3>
                            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', margin: 0 }}>{totalStudents}</p>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', borderRadius: '12px' }}>
                            <Users size={24} />
                        </div>
                    </div>
                    <div style={{ height: '40px', width: '100%', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceTrend}>
                                <Area type="monotone" dataKey="count" stroke="var(--primary-color)" fill="var(--primary-glow)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card stat-card interactive-card" onClick={() => navigate('/attendance')} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Present Today</h3>
                            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', margin: 0 }}>84%</p>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '12px' }}>
                            <UserCheck size={24} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 700 }}>
                        <TrendingUp size={14} /> +12% from last Sabbath
                    </div>
                </div>

                <div className="card stat-card interactive-card" onClick={() => navigate('/reports')} style={{ padding: '1.5rem', border: studentsNeedingVisit.length > 0 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visit Alerts</h3>
                            <p style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', margin: 0 }}>{studentsNeedingVisit.length}</p>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', borderRadius: '12px' }}>
                            <UserX size={24} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {studentsNeedingVisit.slice(0, 3).map((s, i) => (
                            <div key={i} className="avatar" style={{ width: '24px', height: '24px', fontSize: '0.6rem', border: '2px solid var(--bg-color)', marginLeft: i > 0 ? '-8px' : '0' }}>{s.avatar}</div>
                        ))}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '4px' }}>Requires immediate follow-up</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Attendance Trend</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Weekly participation count across all classes</p>
                        </div>
                        <div className="badge badge-primary" style={{ padding: '0.5rem 1rem' }}>Last 5 Sabbaths</div>
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceTrend}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 12 }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'white' }}
                                    itemStyle={{ color: 'var(--primary-color)', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="count" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>Class Distribution</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Active enrollment per class group</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{classes.length} Total Groups</div>
                        </div>
                    </div>
                    <div style={{ height: '250px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classDistData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-dim)', fontSize: 11 }} width={100} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {classDistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card interactive-card" onClick={() => navigate('/reports')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                            <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-glow)', borderRadius: '10px', color: 'var(--primary-color)' }}>
                                <TrendingUp size={18} />
                            </div> 
                            Classes Overview
                        </h3>
                        <ChevronRight size={20} style={{ color: 'var(--text-dim)' }} />
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ padding: '0.75rem 1rem' }}>Class Name</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Roll</th>
                                    <th style={{ padding: '0.75rem 1rem' }}>Room</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.slice(0, 5).map(c => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 600, color: 'white' }}>{c.name}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '0.875rem' }}>{students.filter(s => s.classId === c.id).length}</span>
                                                <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${Math.min(100, (students.filter(s => s.classId === c.id).length / 20) * 100)}%`, height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{c.room}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card interactive-card" onClick={() => navigate('/attendance')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', borderRadius: '10px' }}>
                                <Users size={18} />
                            </div>
                            My Assigned Classes
                        </h3>
                        <ChevronRight size={20} style={{ color: 'var(--text-dim)' }} />
                    </div>
                    {teacherClasses.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                            No classes assigned to this teacher.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                            {teacherClasses.map(c => (
                                <div key={c.id} style={{ padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'all 0.2s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            <BookOpen size={16} />
                                        </div>
                                        <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{c.room}</span>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>{c.name}</h4>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{students.filter(s => s.classId === c.id).length} Students</p>
                                    </div>
                                    {c.lessonLink && (
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{ width: '100%', fontSize: '0.65rem', padding: '0.35rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', backgroundColor: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary-color)' }}
                                            onClick={(e) => { e.stopPropagation(); window.open(c.lessonLink, '_blank'); }}
                                        >
                                            Lesson Material
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '10px' }}>
                            <Clock size={18} />
                        </div>
                        Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { user: 'Sarah Jenkins', action: 'submitted attendance for', target: 'Nursery', time: '10 mins ago', initial: 'SJ', color: '#6366f1' },
                            { user: 'Michael Chen', action: 'submitted attendance for', target: 'Toddlers', time: '15 mins ago', initial: 'MC', color: '#10b981' },
                            { user: 'System', action: 'generated weekly report', target: '', time: '1 hour ago', initial: 'SYS', color: '#8b5cf6' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div className="avatar" style={{ width: '36px', height: '36px', minWidth: '36px', fontSize: '0.75rem', backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>{item.initial}</div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                                        <span style={{ fontWeight: 700, color: 'white' }}>{item.user}</span> 
                                        <span style={{ color: 'var(--text-dim)', margin: '0 0.25rem' }}>{item.action}</span>
                                        {item.target && <span style={{ fontWeight: 700, color: 'white' }}>{item.target}</span>}
                                    </p>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                                        <Clock size={10} /> {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', borderRadius: '10px' }}>
                            <Gift size={18} />
                        </div>
                        Upcoming Birthdays
                    </h3>
                    {upcomingBirthdays.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: 'var(--radius-md)' }}>
                            No birthdays this month.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {upcomingBirthdays.slice(0, 4).map(s => {
                                const cls = classes.find(c => c.id === s.classId);
                                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                const monthName = s.birthdayMonth ? months[parseInt(s.birthdayMonth) - 1] : "";
                                return (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className="avatar" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', fontSize: '0.85rem' }}>{s.avatar}</div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>{s.name}</p>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <BookOpen size={10} /> {cls?.name} • {monthName} {s.birthdayDay}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary" style={{ fontSize: '0.65rem', padding: '0.4rem 0.75rem', borderRadius: '8px' }} onClick={() => alert(`Sending Birthday congrats to ${s.name}!`)}>
                                            Wish Happy B-Day
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', borderRadius: '10px' }}>
                            <UserX size={18} />
                        </div>
                        Action Required
                    </h3>
                    {studentsNeedingVisit.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', backgroundColor: 'rgba(30, 41, 59, 0.3)', borderRadius: 'var(--radius-md)' }}>
                            No students need visits right now.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {studentsNeedingVisit.slice(0, 4).map(s => {
                                const cls = classes.find(c => c.id === s.classId);
                                return (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'rgba(244, 63, 94, 0.05)', borderRadius: '14px', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className="avatar" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', fontSize: '0.85rem' }}>{s.avatar}</div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>{s.name}</p>
                                                <span style={{ fontSize: '0.7rem', color: 'rgba(244, 63, 94, 0.7)', fontWeight: 600 }}>Missed 2+ Sabbaths • {cls?.name}</span>
                                            </div>
                                        </div>
                                        <button className="btn" style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--danger-color)', color: 'white', fontSize: '0.65rem', borderRadius: '8px' }} onClick={() => alert(`Sending follow-up Email...`)}>
                                            Send Email
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1), transparent)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '10px' }}>
                            <Globe size={18} />
                        </div>
                        Today's Mission Story
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Inspire your class with the weekly global mission story (Mission Spotlight).
                    </p>
                    <a
                        href="https://am.adventistmission.org/mission-spotlight?lang=fr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success"
                        style={{ textDecoration: 'none', width: '100%', borderRadius: '12px', padding: '1rem', fontSize: '0.9rem', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}
                    >
                        View Mission Spotlight <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
