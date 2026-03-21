import React from 'react';
import { useAuth } from '../../context/AuthContext';
import JobList from '../JobList';
import { Building, PlusCircle } from 'lucide-react';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const profile = user.profile || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Portal</h1>
          <p style={{color: 'var(--text-muted)'}}>{profile.company_name || 'Your Company'} Dashboard</p>
        </div>
        <button className="btn btn-primary">
          <PlusCircle size={18} />
          Post New Job
        </button>
      </div>
      
      <div className="grid-cards">
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-lg)' }}>
            <Building size={32} color="var(--accent-primary)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Industry</p>
            <h3>{profile.industry || 'Technology'}</h3>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Your Active Job Postings</h2>
        <JobList viewOnly={true} />
      </div>
    </div>
  );
};

export default CompanyDashboard;
