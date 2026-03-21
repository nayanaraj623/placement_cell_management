import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Award, CheckCircle } from 'lucide-react';

const JobList = ({ viewOnly = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // If company, maybe filter by their jobs. If student, fetch all.
      const url = user.role === 'Company' ? `/jobs?company_id=${user.profile?.id}` : '/jobs';
      const res = await api.get(url);
      setJobs(res.data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      const res = await api.post('/placements/apply', { job_id: jobId });
      alert(`Applied Successfully! AI Screen Score: ${res.data.ai_score}/100`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying for job');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (jobs.length === 0) return <p style={{color: 'var(--text-muted)'}}>No jobs available at the moment.</p>;

  return (
    <div className="grid-cards">
      {jobs.map((job) => (
        <div key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{job.role}</h3>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{job.company_name}</p>
              </div>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                <Briefcase size={20} color="var(--accent-primary)" />
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {job.description}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> <span>{job.location || 'Remote/Anywhere'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} /> <span>${job.salary} / year</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} /> <span>Req. CGPA: <strong color="var(--text-primary)">{job.criteria_cgpa}</strong></span>
              </div>
            </div>
          </div>
          
          {!viewOnly && user.role === 'Student' && (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => handleApply(job.id)}
              disabled={applying === job.id}
            >
              {applying === job.id ? 'Applying...' : <><CheckCircle size={18} /> Apply Now</>}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobList;
