import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, Shield, Globe, Mail, Save, Image, CheckCircle, Bell } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const {
        churchName,
        churchLogo,
        updateChurchSettings,
        extraEmails,
        updateExtraEmails
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
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>System Administration</h2>
                <p style={{ color: 'var(--text-muted)' }}>Central control for church configuration and reporting and and system-wide settings.</p>
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
                                placeholder="E.g. Philadelphie SDA Church"
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
                                <h4 style={{ fontSize: '0.9rem', color: 'white' }}>Multi-User Lockout</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prevent teachers from editing records after Sabbath ends.</p>
                            </div>
                            <div style={{ width: '40px', height: '20px', backgroundColor: 'var(--primary-color)', borderRadius: '20px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'white' }}>Automated Cloud Backups</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sync attendance data to safe-storage daily.</p>
                            </div>
                            <div style={{ width: '40px', height: '20px', backgroundColor: 'var(--surface-hover)', borderRadius: '20px', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', backgroundColor: '#94a3b8', borderRadius: '50%', position: 'absolute', left: '2px', top: '2px' }}></div>
                            </div>
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
