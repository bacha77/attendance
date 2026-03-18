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
  const { churchName, churchLogo } = useAppContext();
  return (
    <div className={`splash-screen ${fade ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-logo-bg"></div>
          {churchLogo ? (
            <img src={churchLogo} alt="Logo" className="splash-logo-img" />
          ) : (
            <BookOpen size={48} className="splash-logo-icon" />
          )}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h1 className="splash-text">
            {churchName.includes('PHILADELPHIE') ? 'PHILADELPHIE' : churchName}
          </h1>
          <p className="splash-subtext">Sabbath School System</p>
        </div>
        <div className="splash-loader">
          <div className="splash-loader-bar" style={{ animationDuration: '4s' }}></div>
        </div>
      </div>
    </div>
  );
};

const PinLogin: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const correctPin = '43224';

  const handlePress = (num: string) => {
    if (pin.length < 5) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 5) {
        if (newPin === correctPin) {
          onAuth();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleClear = () => setPin('');

  return (
    <div className="pin-screen">
      <div className="pin-container">
        <div className="pin-header" style={{ marginBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'white' }}>Security Access</h2>
          <p style={{ color: 'var(--text-muted)' }}>Please enter your church security PIN.</p>
        </div>

        <div className="pin-indicators" style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`}></div>
          ))}
        </div>

        <div className="numpad" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', maxWidth: '280px', margin: '0 auto' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button key={num} className="num-btn" onClick={() => handlePress(num)}>{num}</button>
          ))}
          <button className="num-btn special" onClick={handleClear} style={{ background: 'transparent', borderColor: 'transparent', color: 'var(--text-muted)' }}>C</button>
          <button className="num-btn" onClick={() => handlePress('0')}>0</button>
          <button className="num-btn special" onClick={() => { }} style={{ background: 'transparent', borderColor: 'transparent', color: 'var(--text-muted)' }}>×</button>
        </div>

        {error && <div className="pin-error-text" style={{ color: 'var(--danger-color)', marginTop: '1.5rem', fontWeight: 500 }}>Incorrect PIN. Please try again.</div>}
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ss_authenticated') === 'true';
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeSplash(true);
      setTimeout(() => setShowSplash(false), 800);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
    localStorage.setItem('ss_authenticated', 'true');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <Router basename="/attendance">
      {showSplash ? (
        <SplashScreen fade={fadeSplash} />
      ) : !isAuthenticated ? (
        <PinLogin onAuth={handleAuth} />
      ) : (
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
                  <button className="btn" style={{ color: 'var(--danger-color)', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'transparent' }} onClick={() => { localStorage.removeItem('ss_authenticated'); setIsAuthenticated(false); setProfileModalOpen(false); }}>Sign Out</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Router>
  );
};

export default App;
