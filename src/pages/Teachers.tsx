import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import { UserPlus, Search, BookOpen, Settings, Trash2 } from 'lucide-react';

const Teachers: React.FC = () => {
    const { teachers, classes, assignTeacher, unassignTeacher, addTeacher, updateTeacher, removeTeacher } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'teacher' | 'admin'>('teacher');

    const handleAddTeacher = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTeacherId) {
            updateTeacher(editingTeacherId, { name, email, role });
        } else {
            addTeacher({ name, email, role });
        }
        setIsModalOpen(false);
        setEditingTeacherId(null);
        setName('');
        setEmail('');
        setRole('teacher');
    };

    const handleEditTeacher = (teacher: any) => {
        setEditingTeacherId(teacher.id);
        setName(teacher.name);
        setEmail(teacher.email);
        setRole(teacher.role);
        setIsModalOpen(true);
    };

    const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Teacher Assignment</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Assign teachers to their respective Sabbath school classes.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={18} /> Add New Teacher
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search teachers..."
                    style={{ paddingLeft: '2.5rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid-cards">
                {filteredTeachers.map(teacher => (
                    <div key={teacher.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.25rem' }}>{teacher.avatar}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{teacher.name}</h3>
                                            <span className={`badge ${teacher.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', textTransform: 'uppercase' }}>
                                                {teacher.role}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{teacher.email}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn-icon" onClick={() => handleEditTeacher(teacher)} style={{ width: '28px', height: '28px' }}>
                                            <Settings size={14} />
                                        </button>
                                        <button className="btn-icon" onClick={() => removeTeacher(teacher.id)} style={{ width: '28px', height: '28px', color: 'var(--danger-color)' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Assigned Classes</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {teacher.classIds.length === 0 ? (
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No classes assigned</span>
                                ) : (
                                    teacher.classIds.map(classId => {
                                        const cls = classes.find(c => c.id === classId);
                                        return cls ? (
                                            <span key={classId} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <BookOpen size={12} /> {cls.name}
                                                <button
                                                    onClick={() => unassignTeacher(teacher.id, classId)}
                                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ) : null;
                                    })
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Assign to Class</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    className="form-control"
                                    style={{ appearance: 'none' }}
                                    defaultValue=""
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            assignTeacher(teacher.id, e.target.value);
                                            e.target.value = ""; // reset
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select a class...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id} disabled={teacher.classIds.includes(c.id)}>
                                            {teacher.classIds.includes(c.id) ? '✓ ' : ''}{c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Teacher Modal */}
            {isModalOpen && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{editingTeacherId ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                        <form onSubmit={handleAddTeacher}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required placeholder="E.g. Jane Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="teacher@example.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">System Role</label>
                                <select className="form-control" value={role} onChange={e => setRole(e.target.value as 'teacher' | 'admin')}>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin / Organizer</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setIsModalOpen(false); setEditingTeacherId(null); }} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingTeacherId ? 'Update' : 'Save'} Teacher</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Teachers;
