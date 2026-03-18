import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, ExternalLink, Info } from 'lucide-react';

const Lessons: React.FC = () => {
    const { classes } = useAppContext();

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Sabbath School Lesson Resources</h2>
                <p style={{ color: 'var(--text-muted)' }}>Access the "Alive in Jesus" study materials for all age groups.</p>
            </div>

            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--primary-glow)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Info size={24} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                <div>
                    <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>Note to Teachers</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        These resources are hosted by "Alive in Jesus". Click a class button below to open the lesson for the current Sabbath in a new tab.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {classes.filter(c => c.lessonLink).map(c => (
                    <div key={c.id} className="card interactive-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                    <BookOpen size={24} />
                                </div>
                                <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>{c.ageGroup}</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>{c.name}</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Location: {c.room}</p>
                        </div>

                        <a
                            href={c.lessonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
                        >
                            Open Weekly Lesson <ExternalLink size={16} />
                        </a>
                    </div>
                ))}
            </div>

            {/* Default Adult Resources if no specific link */}
            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Additional Adult Resources</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a href="https://www.ssnet.org/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem' }}>
                        SSNET (Adult Study Guide) <ExternalLink size={14} />
                    </a>
                    <a href="https://www.sabbathtruth.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem' }}>
                        Sabbath Truth <ExternalLink size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Lessons;
