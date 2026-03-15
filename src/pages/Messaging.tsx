import React, { useState } from 'react';
import { Send, Users, User, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Messaging: React.FC = () => {
    const { classes, teachers } = useAppContext();
    const [targetType, setTargetType] = useState<'all' | 'class' | 'student'>('all');
    const [selectedTarget, setSelectedTarget] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message || !subject) return;

        // Simulate sending email/sms
        console.log(`Sending message to ${targetType}: ${selectedTarget}`, { subject, message });
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setMessage('');
            setSubject('');
            setSelectedTarget('');
        }, 3000);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Sabbath School Teachers Messaging</h2>
                <p style={{ color: 'var(--text-muted)' }}>Send announcements, updates, and direct messages to Sabbath School Teachers.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                <div className="card" style={{ alignSelf: 'start' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600 }}>Recipient Selection</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <button
                            className={`btn ${targetType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ justifyContent: 'flex-start' }}
                            onClick={() => setTargetType('all')}
                        >
                            <Users size={18} /> All Teachers
                        </button>
                        <button
                            className={`btn ${targetType === 'class' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ justifyContent: 'flex-start' }}
                            onClick={() => setTargetType('class')}
                        >
                            <LayoutGrid size={18} /> By Class
                        </button>
                        <button
                            className={`btn ${targetType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ justifyContent: 'flex-start' }}
                            onClick={() => setTargetType('student')}
                        >
                            <User size={18} /> Individual Teacher
                        </button>
                    </div>

                    {targetType === 'class' && (
                        <div className="form-group animate-fade-in">
                            <label className="form-label">Select Class</label>
                            <select
                                className="form-control"
                                value={selectedTarget}
                                onChange={e => setSelectedTarget(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                <option value="" disabled>Choose a class...</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}

                    {targetType === 'student' && (
                        <div className="form-group animate-fade-in">
                            <label className="form-label">Select Teacher</label>
                            <select
                                className="form-control"
                                value={selectedTarget}
                                onChange={e => setSelectedTarget(e.target.value)}
                                style={{ appearance: 'none' }}
                            >
                                {teachers?.map(t => <option key={t.id} value={t.id}>{t.name} - {t.email}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="card">
                    {sent ? (
                        <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)' }} className="animate-fade-in">
                            <CheckCircle2 size={64} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Message Sent!</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Teachers have been notified via Email.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSend} className="animate-fade-in">
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="E.g. Reminder: Sabbath School Field Trip Next Week"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    required
                                    style={{ fontSize: '1rem', padding: '1rem' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Message Body</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Type your message here..."
                                    rows={10}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    required
                                    style={{ resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {targetType === 'all' ? `Sending to all teachers` :
                                        targetType === 'class' && selectedTarget ? `Sending to class teachers` :
                                            targetType === 'student' && selectedTarget ? `Direct message` : ''}
                                </span>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                                    <Send size={18} /> Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messaging;
