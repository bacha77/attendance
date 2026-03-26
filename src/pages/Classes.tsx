import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, Users, Settings, Search, Trash2, CheckSquare, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Classes: React.FC = () => {
    const { classes, students, addClass, updateClass, removeClass, addStudent, updateStudent, removeStudent } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [rosterClassId, setRosterClassId] = useState<string | 'all'>('all');

    // Modal states
    const [isClassModalOpen, setClassModalOpen] = useState(false);
    const [isStudentModalOpen, setStudentModalOpen] = useState(false);
    const [editingClassId, setEditingClassId] = useState<string | null>(null);
    const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
    const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

    // Form states
    const [className, setClassName] = useState('');
    const [classAge, setClassAge] = useState('');
    const [classRoom, setClassRoom] = useState('');

    const [studentName, setStudentName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [parentPhone, setParentPhone] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdayMonth, setBirthdayMonth] = useState('');
    const [birthdayDay, setBirthdayDay] = useState('');

    const handleAddClass = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClassId) {
            updateClass(editingClassId, { name: className, ageGroup: classAge, room: classRoom });
        } else {
            addClass({ name: className, ageGroup: classAge, room: classRoom });
        }
        setClassModalOpen(false);
        setEditingClassId(null);
        setClassName(''); setClassAge(''); setClassRoom('');
    };

    const handleEditClass = (cls: any) => {
        setEditingClassId(cls.id);
        setClassName(cls.name);
        setClassAge(cls.ageGroup);
        setClassRoom(cls.room);
        setClassModalOpen(true);
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        const studentData = {
            name: studentName,
            classId: selectedClassId,
            parentEmail,
            parentPhone,
            email,
            phone,
            birthdayMonth,
            birthdayDay,
            avatar: studentName.charAt(0).toUpperCase()
        };

        if (editingStudentId) {
            updateStudent(editingStudentId, studentData);
        } else {
            addStudent(studentData);
        }

        setStudentModalOpen(false);
        setEditingStudentId(null);
        setStudentName(''); setParentEmail(''); setParentPhone(''); setEmail(''); setPhone(''); setBirthdayMonth(''); setBirthdayDay('');
    };

    const handleEditStudent = (student: any) => {
        setEditingStudentId(student.id);
        setSelectedClassId(student.classId);
        setStudentName(student.name);
        setParentEmail(student.parentEmail || '');
        setParentPhone(student.parentPhone || '');
        setEmail(student.email || '');
        setPhone(student.phone || '');
        setBirthdayMonth(student.birthdayMonth || '');
        setBirthdayDay(student.birthdayDay || '');
        setStudentModalOpen(true);
    };

    const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Classes & Students</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage Sabbath School classes and enroll students.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => setStudentModalOpen(true)}>
                        <Plus size={18} /> Add Student
                    </button>
                    <button className="btn btn-primary" onClick={() => setClassModalOpen(true)}>
                        <Plus size={18} /> Add New Class
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search classes..."
                    style={{ paddingLeft: '2.5rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid-cards">
                {filteredClasses.map(c => {
                    const classStudents = students.filter(s => s.classId === c.id);
                    return (
                        <div
                            key={c.id}
                            className="card interactive-card"
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                            onClick={() => navigate(`/attendance/${c.id}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {c.name}
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{c.ageGroup} | {c.room}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleEditClass(c); }}><Settings size={18} /></button>
                                    <button className="btn-icon" style={{ color: 'var(--danger-color)' }} onClick={(e) => { e.stopPropagation(); removeClass(c.id); }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                    <Users size={18} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{classStudents.length} Students</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: 'none' }}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/attendance/${c.id}`); }}
                                        title="Take Attendance"
                                    >
                                        <CheckSquare size={18} />
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', border: 'none' }}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/offerings/${c.id}`); }}
                                        title="Collect Offering"
                                    >
                                        <DollarSign size={18} />
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedClassId(c.id); setStudentModalOpen(true); }}
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Student Roster</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <select
                            className="form-control"
                            style={{ width: 'auto', minWidth: '200px' }}
                            value={rosterClassId}
                            onChange={(e) => setRosterClassId(e.target.value)}
                        >
                            <option value="all">All Classes</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Class</th>
                                    <th>Contact Info</th>
                                    <th>Birthday</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students
                                    .filter(s => rosterClassId === 'all' || s.classId === rosterClassId)
                                    .map(s => {
                                        const cls = classes.find(c => c.id === s.classId);
                                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                        return (
                                            <tr key={s.id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div className="avatar avatar-sm">{s.avatar}</div>
                                                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                                                    </div>
                                                </td>
                                                <td>{cls?.name || 'Unknown'}</td>
                                                <td>
                                                    <div style={{ fontSize: '0.875rem' }}>
                                                        {s.parentEmail && <div style={{ color: 'var(--text-muted)' }}>{s.parentEmail}</div>}
                                                        {s.email && <div style={{ color: 'var(--text-muted)' }}>{s.email}</div>}
                                                    </div>
                                                </td>
                                                <td>{s.birthdayMonth ? `${months[parseInt(s.birthdayMonth) - 1]} ${s.birthdayDay}` : '-'}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                        <button className="btn-icon" onClick={() => handleEditStudent(s)} title="Edit Student" style={{ width: '32px', height: '32px' }}>
                                                            <Settings size={16} />
                                                        </button>
                                                        <button className="btn-icon" style={{ color: 'var(--danger-color)', width: '32px', height: '32px' }} onClick={() => removeStudent(s.id)} title="Delete Student">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Class Modal */}
            {isClassModalOpen && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{editingClassId ? 'Edit Class' : 'Create New Class'}</h2>
                        <form onSubmit={handleAddClass}>
                            <div className="form-group">
                                <label className="form-label">Class Name</label>
                                <input type="text" className="form-control" value={className} onChange={e => setClassName(e.target.value)} required placeholder="e.g. Pre-Teens" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age Group</label>
                                <input type="text" className="form-control" value={classAge} onChange={e => setClassAge(e.target.value)} required placeholder="e.g. 11-12 Years" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Room / Location</label>
                                <input type="text" className="form-control" value={classRoom} onChange={e => setClassRoom(e.target.value)} required placeholder="e.g. Room 205" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setClassModalOpen(false); setEditingClassId(null); }} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingClassId ? 'Update' : 'Add'} Class</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Student Modal */}
            {isStudentModalOpen && createPortal(
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{editingStudentId ? 'Edit Student' : 'Enroll Student'}</h2>
                        <form onSubmit={handleAddStudent}>
                            <div className="form-group">
                                <label className="form-label">Student Name</label>
                                <input type="text" className="form-control" value={studentName} onChange={e => setStudentName(e.target.value)} required placeholder="E.g. John Doe" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Assign to Class</label>
                                <select className="form-control" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} required style={{ appearance: 'none' }}>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.ageGroup})</option>)}
                                </select>
                            </div>
                            {classes.find(c => c.id === selectedClassId)?.ageGroup !== 'Adults' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Contact Email (Optional)</label>
                                        <input type="email" className="form-control" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="contact@example.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Contact Phone (Optional)</label>
                                        <input type="tel" className="form-control" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="555-0199" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Email Address (Optional)</label>
                                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@example.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number (Optional)</label>
                                        <input type="tel" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} placeholder="555-0199" />
                                    </div>
                                </>
                            )}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Birthday Month</label>
                                    <select className="form-control" value={birthdayMonth} onChange={e => setBirthdayMonth(e.target.value)} style={{ appearance: 'none' }}>
                                        <option value="">Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Birthday Day</label>
                                    <input type="number" min="1" max="31" className="form-control" value={birthdayDay} onChange={e => setBirthdayDay(e.target.value)} placeholder="1-31" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setStudentModalOpen(false); setEditingStudentId(null); }} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingStudentId ? 'Update' : 'Save'} Student</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Classes;
