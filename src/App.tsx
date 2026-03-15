import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, UserCheck, BarChart3, MessageSquare, Menu, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Messaging from './pages/Messaging';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AppProvider>
      <Router>
        <div className="app-layout">
          {/* Mobile Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            style={{ display: sidebarOpen && window.innerWidth <= 768 ? 'block' : 'none' }}
            onClick={toggleSidebar}
          />

          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="brand" style={{ gap: '0.75rem' }}>
              <img src="/logo.png" alt="Church Logo" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>PHILADELPHIE</span>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600 }}>SDA CHURCH</span>
              </div>
            </div>

            <nav className="nav-links">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
              <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <UserCheck size={20} />
                Attendance Entry
              </NavLink>
              <NavLink to="/classes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <BookOpen size={20} />
                Classes & Students
              </NavLink>
              <NavLink to="/teachers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <Users size={20} />
                Teacher Assignment
              </NavLink>
              <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <BarChart3 size={20} />
                Reports & Export
              </NavLink>
              <NavLink to="/messaging" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 768 && setSidebarOpen(false)}>
                <MessageSquare size={20} />
                Teachers Messaging
              </NavLink>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="avatar">AD</div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin User</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Organizer</div>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="topbar">
              <button className="btn-icon" onClick={toggleSidebar} style={{ display: window.innerWidth > 768 ? 'none' : 'block' }}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="page-title">Sabbath School System</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>Online</button>
              </div>
            </header>

            <div className="page-container animate-fade-in">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/messaging" element={<Messaging />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
