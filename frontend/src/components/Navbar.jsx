import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <header style={styles.navbar}>
      <div style={styles.left}>
        <h3 style={styles.greeting}>Welcome back, {user.username}!</h3>
      </div>
      <div style={styles.right}>
        <div style={styles.roleBadge}>{user.role}</div>
        <div style={styles.avatar}>
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-sm)',
  },
  greeting: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  roleBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: '#a78bfa',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
  }
};

export default Navbar;
