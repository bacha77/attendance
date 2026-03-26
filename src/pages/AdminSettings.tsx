import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, Shield, Globe, Mail, Save, Image, CheckCircle, Bell, Trash2 } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const {
        churchName,
        churchLogo,
        updateChurchSettings,
        extraEmails,
        updateExtraEmails,
        clearAllData
    } = useAppContext();

    const [tempName, setTempName] = useState(churchName);
    const [tempLogo, setTempLogo] = useState(churchLogo);
    const [newEmail, setNewEmail] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleSaveGlobal = (e: React.FormEvent) => {
        e.preventDefault();
        updateChurchSettings(tempName, tempLogo);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleAddEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmail && !extraEmails.includes(newEmail)) {
            updateExtraEmails([...extraEmails, newEmail]);
            setNewEmail('');
        }
    };

    const handleRemoveEmail = (email: string) => {
        updateExtraEmails(extraEmails.filter(e => e !== email));
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                    System <span style={{ color: 'var(--primary-color)' }}>Administration</span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Central control for church configuration and system-wide settings.</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '99px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div className="status-dot" style={{ width: '6px', height: '6px' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success-color)', textTransform: 'uppercase' }}>Operational</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                {/* Global Identity */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={20} color="var(--primary-color)" /> Church Identity
                    </h3>
                    <form onSubmit={handleSaveGlobal}>
                        <div className="form-group">
                            <label className="form-label">Church Facility Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={tempName}
                                onChange={e => setTempName(e.target.value)}
                                placeholder="E.g. PHILADELPHIE SEVENTH DAY ADVENTIST CHURCH"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Logo URL / Path</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={tempLogo}
                                    onChange={e => setTempLogo(e.target.value)}
                                    placeholder="/logo.png"
                                />
                                <div style={{ width: '45px', height: '45px', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                                    <Image size={20} color="var(--text-muted)" />
                                </div>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Leave empty to use the system default logo.</p>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: 'fit-content' }}>
                            {isSaved ? <><CheckCircle size={18} /> Settings Saved</> : <><Save size={18} /> Save Identity</>}
                        </button>
                    </form>
                </div>

                {/* Notification Recipients */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={20} color="var(--primary-color)" /> Report Distribution List
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Manage who automatically receives the weekly Sabbath School attendance reports.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {extraEmails.map((email, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Bell size={14} color="var(--primary-color)" />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{email}</span>
                                </div>
                                <button
                                    className="btn-icon"
                                    style={{ color: 'var(--danger-color)', width: '24px', height: '24px' }}
                                    onClick={() => handleRemoveEmail(email)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Add new recipient email..."
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-secondary">Add</button>
                    </form>
                </div>

                {/* Advanced Security */}
                <div className="card" style={{ opacity: 0.8 }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={20} color="var(--warning-color)" /> Security & Control
                    </h3>
                    <div style={{ borderLeft: '4px solid var(--warning-color)', padding: '0.75rem 1rem', backgroundColor: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#fbbf24' }}>Administrative privileges are currently granted based on the 'Admin' user role.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>Multi-User Lockout</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Prevent teachers from editing records after Sabbath ends.</p>
                            </div>
                            <div style={{ width: '48px', height: '24px', backgroundColor: 'var(--primary-color)', borderRadius: '24px', position: 'relative', cursor: 'pointer', boxShadow: '0 0 10px var(--primary-glow)' }}>
                                <div style={{ width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '3px', top: '3px', transition: '0.3s' }}></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: '0.15rem' }}>Automated Cloud Backups</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sync attendance data to safe-storage daily.</p>
                            </div>
                            <div style={{ width: '48px', height: '24px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', position: 'relative', cursor: 'pointer', border: '1px solid var(--border-color)' }}>
                                <div style={{ width: '18px', height: '18px', backgroundColor: 'var(--text-dim)', borderRadius: '50%', position: 'absolute', left: '3px', top: '2px', transition: '0.3s' }}></div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', border: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => clearAllData()}
                            >
                                <Trash2 size={18} /> Clear Mock Data & Fresh Start
                            </button>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                                This will remove the demonstration students and teachers to let you enter your own records.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Version Info */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--surface-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Settings size={30} color="var(--text-muted)" className="spin-slow" />
                    </div>
                    <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>Sabbath School System v1.4</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Build: 2026.03.17-Final</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--primary-color)', marginTop: '1rem', fontWeight: 600 }}>All Systems Operational</p>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
