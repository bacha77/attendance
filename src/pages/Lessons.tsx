import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, ExternalLink, Info, Globe } from 'lucide-react';

const Lessons: React.FC = () => {
    const { classes } = useAppContext();

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: '1', marginBottom: '1rem' }}>
                    Study <span style={{ color: 'var(--primary-color)' }}>Resources</span>
                </h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '600px' }}>Access the "Alive in Jesus" study materials for all age groups through our integrated learning portal.</p>
            </div>

            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-glow)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                    <Info size={24} style={{ flexShrink: 0 }} />
                </div>
                <div>
                    <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '0.25rem' }}>Teacher Orientation</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                        Lessons are hosted on the <strong style={{ color: 'var(--primary-color)' }}>Alive in Jesus</strong> platform. Select your class below to open external study materials.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {classes.filter(c => c.lessonLink).map((c, idx) => {
                    const colors = [
                        'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                        'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                        'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(225, 29, 72, 0.05))',
                        'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))'
                    ];
                    const accentColor = ['var(--primary-color)', 'var(--success-color)', 'var(--danger-color)', 'var(--warning-color)'][idx % 4];
                    
                    return (
                        <div key={c.id} className="card interactive-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', background: colors[idx % 4], border: `1px solid rgba(255,255,255,0.03)` }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <BookOpen size={28} />
                                    </div>
                                    <span className="badge" style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}>{c.ageGroup}</span>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.02em' }}>{c.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: accentColor }}></div>
                                    Location: {c.room}
                                </p>
                            </div>

                            <a
                                href={c.lessonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    gap: '0.5rem', 
                                    textDecoration: 'none',
                                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                                    color: 'white',
                                    fontWeight: 700,
                                    boxShadow: `0 10px 20px ${accentColor}30`
                                }}
                            >
                                Open Weekly Lesson <ExternalLink size={16} />
                            </a>
                        </div>
                    );
                })}
            </div>

            {/* Global Session Resources */}
            <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <Globe size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', color: 'white' }}>Mission Spotlight</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                    Watch the weekly mission story from around the world. These stories inspire our global church family.
                </p>
                <a
                    href="https://am.adventistmission.org/mission-spotlight?lang=fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', display: 'flex', gap: '0.5rem', width: 'fit-content', marginTop: '1rem' }}
                >
                    View Mission Story (Français) <ExternalLink size={18} />
                </a>
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
