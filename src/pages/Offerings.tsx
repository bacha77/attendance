import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DollarSign, Calendar, Save, CheckCircle, Wallet } from 'lucide-react';
import PageBanner from '../components/PageBanner';

const Offerings: React.FC = () => {
    const { classes, recordOffering, offerings } = useAppContext();
    const { classId } = useParams<{ classId: string }>();
    const [date, setDate] = useState(() => {
        const d = new Date();
        const day = d.getDay();
        const offset = (day + 1) % 7;
        d.setDate(d.getDate() - offset);
        return d.toISOString().split('T')[0];
    });

    const [classAmounts, setClassAmounts] = useState<{ [key: string]: string }>({});
    const [savedClasses, setSavedClasses] = useState<string[]>([]);

    const activeClasses = classId ? classes.filter(c => c.id === classId) : classes;

    // Load existing offerings if any
    useEffect(() => {
        const initialAmounts: { [key: string]: string } = {};
        activeClasses.forEach(c => {
            const existing = offerings.find(o => o.classId === c.id && o.date === date);
            initialAmounts[c.id] = existing ? existing.amount.toString() : '';
        });
        setClassAmounts(initialAmounts);
        setSavedClasses([]);
    }, [date, activeClasses.length, offerings]);

    const handleAmountChange = (classId: string, value: string) => {
        // Allow only numbers and decimal
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setClassAmounts(prev => ({ ...prev, [classId]: value }));
            setSavedClasses(prev => prev.filter(id => id !== classId));
        }
    };

    const handleSaveClass = (classId: string) => {
        const amount = parseFloat(classAmounts[classId] || '0');
        recordOffering(classId, date, amount);
        setSavedClasses(prev => [...prev, classId]);
    };

    const handleSaveAll = () => {
        activeClasses.forEach(c => {
            const amount = parseFloat(classAmounts[c.id] || '0');
            recordOffering(c.id, date, amount);
        });
        setSavedClasses(activeClasses.map(c => c.id));
        alert('Offerings saved successfully!');
    };

    return (
        <div className="animate-fade-in">
            <PageBanner 
                title={classId ? `${activeClasses[0]?.name} Offering` : "Financial Stewardship"}
                subtitle={classId ? `Record money for the ${activeClasses[0]?.name} class.` : "Collect and record weekly Sabbath School offerings for each class."}
                icon={Wallet}
                gradient="linear-gradient(135deg, #10b981 0%, #047857 100%)"
                showBack={!!classId}
            />

            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: 0 }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Calendar size={16} /> Sabbath Date:
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        style={{ width: 'auto', fontSize: '0.875rem', padding: '0.4rem 0.75rem' }}
                        value={date}
                        onChange={e => {
                            const d = new Date(e.target.value);
                            const day = d.getUTCDay();
                            if (day !== 6) {
                                alert('Please select a Sabbath (Saturday).');
                                return;
                            }
                            setDate(e.target.value);
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {activeClasses.map(cls => (
                    <div key={cls.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--primary-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{cls.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cls.ageGroup} | {cls.room}</p>
                            </div>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                <DollarSign size={18} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.8rem' }}>Amount Collected ($)</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="0.00"
                                    style={{ paddingLeft: '1.75rem' }}
                                    value={classAmounts[cls.id] || ''}
                                    onChange={e => handleAmountChange(cls.id, e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            className={`btn ${savedClasses.includes(cls.id) ? 'btn-success' : 'btn-secondary'}`}
                            style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
                            onClick={() => handleSaveClass(cls.id)}
                        >
                            {savedClasses.includes(cls.id) ? (
                                <><CheckCircle size={16} /> Saved</>
                            ) : (
                                <><Save size={16} /> Save Amount</>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={handleSaveAll} style={{ padding: '0.75rem 2rem', fontWeight: 600 }}>
                    Submit All Offerings
                </button>
            </div>
        </div>
    );
};

export default Offerings;
