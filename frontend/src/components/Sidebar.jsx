import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Building, Briefcase, FileCheck, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/students', icon: <Users size={20} />, label: 'Students' },
    { to: '/admin/companies', icon: <Building size={20} />, label: 'Companies' },
    { to: '/admin/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
    { to: '/admin/placements', icon: <FileCheck size={20} />, label: 'Placements' },
  ];

  const studentLinks = [
    { to: '/student', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/student/jobs', icon: <Briefcase size={20} />, label: 'Available Jobs' },
    { to: '/student/applications', icon: <FileCheck size={20} />, label: 'My Applications' },
    { to: '/student/profile', icon: <Users size={20} />, label: 'My Profile' },
  ];

  const companyLinks = [
    { to: '/company', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/company/jobs', icon: <Briefcase size={20} />, label: 'My Jobs' },
    { to: '/company/applicants', icon: <Users size={20} />, label: 'Applicants' },
  ];

  let links = [];
  if (user.role === 'Admin') links = adminLinks;
  else if (user.role === 'Student') links = studentLinks;
  else if (user.role === 'Company') links = companyLinks;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h2>PlacementCell</h2>
      </div>
      
      <nav style={styles.nav}>
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.to}
            end={link.to === `/${user.role.toLowerCase()}`}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
  },
  brand: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'var(--accent-primary)',
    textAlign: 'center'
  },
  nav: {
    flex: 1,
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    fontWeight: 500,
  },
  navItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: 'var(--accent-primary)',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid var(--border-subtle)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    fontWeight: 500,
    transition: 'background var(--transition-fast)',
  }
};

export default Sidebar;
