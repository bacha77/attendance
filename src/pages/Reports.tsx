import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, FileSpreadsheet, Award } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports: React.FC = () => {
    const { classes, students, attendance, extraEmails, updateExtraEmails } = useAppContext();
    const [reportType, setReportType] = useState('class'); // 'class' or 'student'
    const [isEditingEmails, setIsEditingEmails] = useState(false);
    const [tempEmails, setTempEmails] = useState(extraEmails.join(', '));

    // Generate chart data for classes
    const classData = classes.map(c => {
        const classStudents = students.filter(s => s.classId === c.id);
        const classAttendance = attendance.filter(a => a.classId === c.id);

        let presentCount = 0;
        let absentCount = 0;
        let sevenDaysStudyCount = 0;

        classAttendance.forEach(a => {
            if (a.status === 'present') presentCount++;
            else if (a.status === 'absent') absentCount++;
            if (a.sevenDaysStudy) sevenDaysStudyCount++;
        });

        return {
            name: c.name,
            present: presentCount,
            absent: absentCount,
            sevenDaysStudy: sevenDaysStudyCount,
            totalStudents: classStudents.length
        };
    });

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(classData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
        XLSX.writeFile(workbook, "Sabbath_School_Report.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Sabbath School Attendance Report", 14, 15);

        const tableColumn = ["Class Name", "Present", "Absent", "7 Days Study", "Total Enrolled"];
        const tableRows: any[] = [];

        classData.forEach(c => {
            tableRows.push([c.name, c.present, c.absent, c.sevenDaysStudy, c.totalStudents]);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("Sabbath_School_Report.pdf");
    };

    const handleSaveEmails = () => {
        const emailList = tempEmails.split(',').map(e => e.trim()).filter(e => e !== '');
        updateExtraEmails(emailList);
        setIsEditingEmails(false);
    };

    const handleDownloadCertificate = (studentName: string) => {
        const doc = new jsPDF({
            orientation: 'landscape',
        });

        // Add a nice border
        doc.setLineWidth(5);
        doc.setDrawColor(139, 92, 246); // Primary color
        doc.rect(10, 10, 277, 190);

        // Text
        doc.setFontSize(40);
        doc.setTextColor(30, 41, 59);
        doc.text("Certificate of Achievement", 148, 50, { align: 'center' });

        doc.setFontSize(20);
        doc.setTextColor(100, 116, 139);
        doc.text("This certifies that", 148, 80, { align: 'center' });

        doc.setFontSize(50);
        doc.setTextColor(99, 102, 241);
        doc.text(studentName, 148, 110, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(100, 116, 139);
        doc.text("has achieved 100% Perfect Attendance", 148, 140, { align: 'center' });
        doc.text("in Sabbath School.", 148, 150, { align: 'center' });

        // Signature Line
        doc.setLineWidth(0.5);
        doc.setDrawColor(100, 116, 139);
        doc.line(100, 180, 196, 180);
        doc.setFontSize(14);
        doc.text("Organizer / Teacher", 148, 186, { align: 'center' });

        doc.save(`Perfect_Attendance_${studentName.replace(/ /g, '_')}.pdf`);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Customizable Reporting</h2>
                    <p style={{ color: 'var(--text-muted)' }}>View and export in-depth attendance data.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handleExportPDF}>
                        <FileText size={18} /> Export PDF
                    </button>
                    <button className="btn btn-primary" onClick={handleExportExcel}>
                        <FileSpreadsheet size={18} /> Export Excel
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <button
                        className={`btn ${reportType === 'class' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setReportType('class')}
                    >
                        By Class Attendance
                    </button>
                    <button
                        className={`btn ${reportType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setReportType('student')}
                    >
                        By Individual Student
                    </button>
                </div>

                {reportType === 'class' ? (
                    <>
                        <div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Attendance by Class Overview</h3>
                            <div style={{ height: '400px', width: '100%', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={classData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--success-color)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="var(--success-color)" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--danger-color)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="var(--danger-color)" stopOpacity={0.2} />
                                            </linearGradient>
                                            <linearGradient id="color7Days" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0.2} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} cursor={{ fill: 'var(--surface-hover)' }} />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                        <Bar dataKey="present" name="Present" fill="url(#colorPresent)" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-out" />
                                        <Bar dataKey="absent" name="Absent" fill="url(#colorAbsent)" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-out" />
                                        <Bar dataKey="sevenDaysStudy" name="7 Days Study" fill="url(#color7Days)" radius={[4, 4, 0, 0]} animationDuration={1500} animationEasing="ease-out" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="card" style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Report Distribution List</h3>
                                <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => setIsEditingEmails(!isEditingEmails)}>
                                    {isEditingEmails ? 'Cancel' : 'Edit List'}
                                </button>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                These emails (Pastor, Clerk, etc.) will be included in the report distribution.
                            </p>

                            {isEditingEmails ? (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={tempEmails}
                                        onChange={e => setTempEmails(e.target.value)}
                                        placeholder="pastor@church.org, clerk@church.org"
                                    />
                                    <button className="btn btn-primary" onClick={handleSaveEmails}>Save</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {extraEmails.map((email, idx) => (
                                        <span key={idx} className="badge badge-secondary" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)' }}>
                                            {email}
                                        </span>
                                    ))}
                                    {extraEmails.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No extra emails added.</span>}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>Individual Student Breakdown</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Class</th>
                                        <th>Present</th>
                                        <th>Absent</th>
                                        <th>7 Days Study</th>
                                        <th>Rate</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.slice(0, 10).map(s => { // Limit to 10 for demo
                                        const studentAtt = attendance.filter(a => a.studentId === s.id);
                                        const pres = studentAtt.filter(a => a.status === 'present').length;
                                        const abs = studentAtt.filter(a => a.status === 'absent').length;
                                        const study = studentAtt.filter(a => a.sevenDaysStudy).length;
                                        const total = pres + abs;
                                        const rate = total > 0 ? ((pres / total) * 100).toFixed(0) : 0;
                                        return (
                                            <tr key={s.id} style={{ transition: 'all 0.3s ease' }}>
                                                <td style={{ fontWeight: 500 }}>{s.name}</td>
                                                <td>{classes.find(c => c.id === s.classId)?.name}</td>
                                                <td><span className="badge badge-success">{pres}</span></td>
                                                <td><span className="badge badge-danger">{abs}</span></td>
                                                <td><span className="badge badge-primary">{study}</span></td>
                                                <td><strong>{rate}%</strong></td>
                                                <td>
                                                    {rate === "100" && total > 0 ? (
                                                        <button
                                                            className="btn btn-secondary"
                                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'flex', gap: '0.25rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}
                                                            onClick={() => handleDownloadCertificate(s.name)}
                                                        >
                                                            <Award size={14} /> Certificate
                                                        </button>
                                                    ) : (
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Reports;
