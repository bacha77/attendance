import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Users, BookOpen, BarChart3, Library, UserPlus, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const HomeHub: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser, churchName } = useAppContext();

    const menuItems = [
        {
            title: 'Take Attendance',
            description: 'Log presence and study for today',
            icon: <UserCheck size={32} />,
            path: '/attendance',
            color: 'var(--success-color)',
            bgColor: 'rgba(16, 185, 129, 0.1)'
        },
        {
            title: 'My Students',
            description: 'View and manage student roster',
            icon: <Users size={32} />,
            path: '/classes',
            color: 'var(--primary-color)',
            bgColor: 'rgba(99, 102, 241, 0.1)'
        },
        {
            title: 'Study Resources',
            description: 'Lessons, manuals and guides',
            icon: <Library size={32} />,
            path: '/lessons',
            color: 'var(--info-color)',
            bgColor: 'rgba(56, 189, 248, 0.1)'
        },
        {
            title: 'Church Reports',
            description: 'View trends and statistics',
            icon: <BarChart3 size={32} />,
            path: '/admin-dashboard',
            color: 'var(--accent-color)',
            bgColor: 'rgba(168, 85, 247, 0.1)'
        }
    ];

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--primary-glow)', borderRadius: '24px', marginBottom: '1.5rem', boxShadow: '0 20px 40px var(--primary-glow-slim)' }}>
                    <BookOpen size={48} className="text-primary" />
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                    Welcome to <span style={{ color: 'var(--primary-color)' }}>{churchName.split(' ')[0]}</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>
                    Sabbath School Portal • Happy Sabbath, {currentUser?.name || 'Teacher'}!
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="card interactive-card" 
                        onClick={() => navigate(item.path)}
                        style={{ padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
                    >
                        <div style={{ padding: '1.25rem', backgroundColor: item.bgColor, color: item.color, borderRadius: '20px', boxShadow: `0 10px 20px ${item.bgColor}` }}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{item.description}</p>
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
