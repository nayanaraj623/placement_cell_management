import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { StudentProfile } from './StudentViews';
import JobList from '../JobList';
import { Award, BookOpen } from 'lucide-react';

// Sub-component for My Applications
const StudentApplications = () => {
  const [apps, setApps] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    api.get(`/placements/student/${user.profile?.id}`).then(res => setApps(res.data)).catch(e => console.error(e));
  }, []);

  return (
    <div>
      <h2 className="page-title mb-4">My Applications</h2>
      {apps.length === 0 ? <p className="text-muted">You haven't applied to any jobs yet.</p> : (
        <div className="table-container">
          <table className="premium-table">
            <thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Score</th></tr></thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id}>
                  <td>{app.company_name}</td>
                  <td>{app.role}</td>
                  <td>
                    <span className={`badge badge-${app.status === 'Applied' ? 'primary' : app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>{app.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StudentHome = () => {
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

const StudentDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentHome />} />
      <Route path="jobs" element={<div><h2 className="page-title mb-4">Available Jobs</h2><JobList /></div>} />
      <Route path="applications" element={<StudentApplications />} />
      <Route path="profile" element={<StudentProfile />} />
    </Routes>
  );
};

export default StudentDashboard;
