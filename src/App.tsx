import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Messaging from './pages/Messaging';
import Offerings from './pages/Offerings';
import AdminSettings from './pages/AdminSettings';
import Lessons from './pages/Lessons';
import { useAppContext } from './context/AppContext';
import { LayoutDashboard, Users, BookOpen, UserCheck, BarChart3, MessageSquare, Menu, DollarSign, Settings, ChevronRight, Library } from 'lucide-react';

const SplashScreen: React.FC<{ fade: boolean }> = ({ fade }) => {
  const { churchName } = useAppContext();
  return (
    <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-logo-bg"></div>
          <BookOpen size={48} className="splash-logo-icon" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h1 className="splash-text">
            {churchName.includes('PHILADELPHIE') ? 'PHILADELPHIE' : churchName}
          </h1>
          <p className="splash-subtext">Sabbath School System</p>
        </div>
        <div className="splash-loader">
          <div className="splash-loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { currentUser, churchName, churchLogo } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeSplash(true);
      setTimeout(() => setShowSplash(false), 800);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <Router basename="/attendance">
      {showSplash && <SplashScreen fade={fadeSplash} />}
      <div className="app-layout">
        {/* Mobile Overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="brand" style={{ gap: '0.75rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
              <img src={churchLogo || `${import.meta.env.BASE_URL}logo.png`} alt="Church Logo" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ display: sidebarCollapsed ? 'none' : 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>{churchName.split(' ')[0]}</span>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600 }}>{churchName.split(' ').slice(1).join(' ')}</span>
              </div>
            </div>
            <button className="btn-icon sidebar-collapse-btn" onClick={toggleCollapse} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
              {sidebarCollapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <UserCheck size={20} />
              Attendance Entry
            </NavLink>
            <NavLink to="/classes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <BookOpen size={20} />
              Classes & Students
            </NavLink>
            <NavLink to="/teachers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Users size={20} />
              Teacher Assignment
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <BarChart3 size={20} />
              Reports & Export
            </NavLink>
            <NavLink to="/messaging" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <MessageSquare size={20} />
              Teachers Messaging
            </NavLink>
            <NavLink to="/offerings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <DollarSign size={20} />
              Class Offerings
            </NavLink>

            <NavLink to="/lessons" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              <Library size={20} />
              Study Resources
            </NavLink>

            {currentUser?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <Settings size={20} />
                System Settings
              </NavLink>
            )}
          </nav>

          <button
            className="btn-secondary"
            style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => setProfileModalOpen(true)}
          >
            <div className="avatar" style={{ border: '2px solid var(--primary-glow)' }}>{currentUser?.avatar || '??'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{currentUser?.name || 'Guest'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{currentUser?.role || 'Visitor'}</div>
            </div>
          </button>
        </aside>

        <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <header className="topbar">
            <button className="btn-icon sidebar-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="page-title">Sabbath School System</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-success" style={{ padding: '0.5rem', fontSize: '0.75rem' }} onClick={() => setProfileModalOpen(true)}>Active Account</button>
            </div>
          </header>

          <div className="page-container animate-fade-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendance/:classId" element={<Attendance />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/offerings" element={<Offerings />} />
              <Route path="/offerings/:classId" element={<Offerings />} />
              <Route path="/admin" element={<AdminSettings />} />
              <Route path="/lessons" element={<Lessons />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setProfileModalOpen(false)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface-color)', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', border: '4px solid var(--primary-color)' }}>{currentUser?.avatar}</div>
            </div>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem' }}>{currentUser?.name}</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 700 }}>{currentUser?.role}</p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="text" className="form-control" value={currentUser?.email} readOnly style={{ opacity: 0.7 }} />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" onClick={() => { alert('Profile setup active!'); setProfileModalOpen(false); }}>Update Information</button>
              <button className="btn btn-secondary" onClick={() => setProfileModalOpen(false)}>Close Modal</button>
              <button className="btn" style={{ color: 'var(--danger-color)', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'transparent' }} onClick={() => { alert('Signing out...'); window.location.reload(); }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
