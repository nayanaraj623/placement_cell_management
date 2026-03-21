import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
      </div>
      
      <div className="grid-cards">
        <div className="card">
          <h3 style={{color: 'var(--text-secondary)'}}>Total Students</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent-primary)'}}>150</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-secondary)'}}>Partner Companies</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--accent-secondary)'}}>24</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-secondary)'}}>Active Jobs</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--warning)'}}>35</p>
        </div>
        <div className="card">
          <h3 style={{color: 'var(--text-secondary)'}}>Placements</h3>
          <p style={{fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--success)'}}>89</p>
        </div>
      </div>
      
      <div className="card">
        <h3>Recent Activity Placeholder</h3>
        <p className="mt-2" style={{color: 'var(--text-muted)'}}>More detailed tables will be built here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
