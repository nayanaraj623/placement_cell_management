import React from 'react';
import { useAuth } from '../../context/AuthContext';
import JobList from '../JobList';
import { Award, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const profile = user.profile || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Portal</h1>
          <p style={{color: 'var(--text-muted)'}}>Welcome back, explore your career opportunities.</p>
        </div>
      </div>
      
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={40} color="var(--accent-primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{profile.name || user.username}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{profile.dept || 'Engineering Department'}</p>
            <div className="mt-2 text-primary" style={{ fontWeight: 600, color: 'var(--success)' }}>
              Current CGPA: {profile.cgpa || 'N/A'}
            </div>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={40} color="var(--accent-secondary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>Skills Match</h3>
            <p style={{ color: 'var(--text-secondary)' }}>AI-Score based on your tech stack</p>
            <div className="mt-2 text-primary" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {profile.skills ? profile.skills : 'Update your profile to add skills for AI matching'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Recommended Jobs</h2>
        <JobList />
      </div>
    </div>
  );
};

export default StudentDashboard;
