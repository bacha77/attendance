import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, BookOpen, BarChart3, Library, UserPlus, MessageSquare, Cake, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PageBanner from '../components/PageBanner';

const HomeHub: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, churchName, students, isCloudSyncing } = useAppContext();

    const menuItems = [
        { title: 'Take Attendance', icon: UserCheck, color: 'var(--success-color)', path: '/attendance', desc: 'Record weekly student presence & study' },
        { title: 'Students Roster', icon: Users, color: 'var(--primary-color)', path: '/classes', desc: 'Manage learners and class assignments' },
        { title: 'Study Lessons', icon: Library, color: 'var(--accent-color)', path: '/lessons', desc: 'View weekly study guides & missions' },
        { title: 'System Reports', icon: BarChart3, color: 'var(--warning-color)', path: '/admin-dashboard', desc: 'Analytics and attendance trends' },
        { title: 'Teacher Message', icon: MessageSquare, color: 'var(--secondary-color)', path: '/messaging', desc: 'Communication for school staff' },
        { title: 'Class Offerings', icon: DollarSign, color: 'var(--success-color)', path: '/offerings', desc: 'Record lesson mission collections' },
    ];

    const currentMonth = (new Date().getMonth() + 1).toString();
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const birthdayStudents = students.filter(s => s.birthdayMonth === currentMonth);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <PageBanner 
                title={`Welcome to ${churchName.split(' ')[0]}`}
                subtitle={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>Sabbath School Portal • Happy Sabbath, {currentUser?.name || 'Teacher'}!</span>
                        {isCloudSyncing ? (
                            <span className="badge animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.65rem', padding: '0.2rem 0.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                                ☁️ SYNCING...
                            </span>
                        ) : (
                            <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: '0.65rem', padding: '0.2rem 0.5rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                ● CLOUD ACTIVE
                            </span>
                        )}
                    </div>
                }
                icon={BookOpen}
                gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
            />

            {/* Quick Stats / Birthday Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', gap: '1.25rem', marginTop: '1rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', color: 'var(--success-color)' }}>
                        <Cake size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{monthNames[parseInt(currentMonth)]} Birthdays</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{birthdayStudents.length || 0} Students</div>
                    </div>
                </div>

                <div className="card" style={{ background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '14px', color: 'var(--primary-color)' }}>
                        <UserPlus size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>School Capacity</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{students.length} Total Students</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="card interactive-card" 
                        onClick={() => navigate(item.path)}
                        style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
                    >
                        <div style={{ padding: '1.25rem', backgroundColor: `${item.color}15`, color: item.color, borderRadius: '20px', boxShadow: `0 10px 20px -5px ${item.color}20` }}>
                            <item.icon size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', lineHeight: '1.4' }}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: 1, minWidth: '300px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), transparent)' }}>
                    <div style={{ color: 'var(--primary-color)' }}><UserPlus size={40} /></div>
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>New Guest Arrived?</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>Quickly add them to your class roster in seconds.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/classes')}>Enroll Guest</button>
                    </div>
                </div>

                <div className="card" style={{ flex: 1, minWidth: '300px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent)' }}>
                    <div style={{ color: 'var(--success-color)' }}><MessageSquare size={40} /></div>
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Teacher Support</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>Need help? Message the Sabbath School superintendent.</p>
                        <button className="btn btn-success" onClick={() => navigate('/messaging')}>Send Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeHub;
