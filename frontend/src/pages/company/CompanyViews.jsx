import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users } from 'lucide-react';

export const CompanyApplicants = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        if (user?.profile?.id) {
            api.get(`/jobs?company_id=${user.profile.id}`)
               .then(r => setJobs(r.data))
               .catch(console.error);
        }
    }, [user]);

    useEffect(() => {
        if (selectedJob) {
            api.get(`/placements/${selectedJob}/applicants`)
               .then(r => setApplicants(r.data))
               .catch(console.error);
        } else {
            setApplicants([]);
        }
    }, [selectedJob]);

    return (
        <div className="card">
            <h2 className="page-title mb-4 flex items-center gap-2"><Users color="var(--accent-primary)" /> Job Applicants</h2>
            
            <div className="form-group mb-4" style={{ maxWidth: '400px' }}>
                <label className="form-label">Select Job Posting</label>
                <select className="form-control" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
                    <option value="">-- Choose a Job --</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.role}</option>)}
                </select>
            </div>

            {selectedJob && (
                <div className="table-container mt-4">
                    <table className="premium-table">
                        <thead><tr><th>Student Name</th><th>Dept</th><th>CGPA</th><th>Skills</th><th>Status</th><th>AI Match Score</th></tr></thead>
                        <tbody>
                            {applicants.map(a => (
                                <tr key={a.id}>
                                    <td>{a.name} <br/><small className="text-muted">{a.email}</small></td>
                                    <td>{a.dept}</td>
                                    <td>{a.cgpa}</td>
                                    <td>{a.skills || 'None listed'}</td>
                                    <td><span className={`badge badge-${a.status === 'Applied' ? 'primary' : a.status === 'Selected' ? 'success' : 'warning'}`}>{a.status}</span></td>
                                    <td>{a.description}</td>
                                </tr>
                            ))}
                            {applicants.length === 0 && <tr><td colSpan="6">No applicants for this job yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
            {!selectedJob && <p className="text-muted">Select a job from the dropdown to view its applicants.</p>}
        </div>
    );
};
