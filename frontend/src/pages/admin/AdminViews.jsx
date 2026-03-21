import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Building, Briefcase, FileCheck, Trash2 } from 'lucide-react';

export const AdminStudents = () => {
    const [data, setData] = useState([]);
    useEffect(() => { api.get('/students').then(r => setData(r.data)).catch(console.error); }, []);
    return (
        <div className="card">
            <h2 className="page-title mb-4 flex items-center gap-2"><Users color="var(--accent-primary)" /> Manage Students</h2>
            <div className="table-container">
                <table className="premium-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>CGPA</th><th>Username</th></tr></thead>
                    <tbody>
                        {data.map(s => <tr key={s.id}><td>#{s.id}</td><td>{s.name}</td><td>{s.dept}</td><td>{s.cgpa}</td><td>{s.username}</td></tr>)}
                        {data.length === 0 && <tr><td colSpan="5">No students found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const AdminCompanies = () => {
    const [data, setData] = useState([]);
    useEffect(() => { api.get('/companies').then(r => setData(r.data)).catch(console.error); }, []);
    return (
        <div className="card">
            <h2 className="page-title mb-4 flex items-center gap-2"><Building color="var(--accent-primary)" /> Manage Companies</h2>
            <div className="table-container">
                <table className="premium-table">
                    <thead><tr><th>ID</th><th>Company Name</th><th>Industry</th><th>Location</th><th>Account Username</th></tr></thead>
                    <tbody>
                        {data.map(c => <tr key={c.id}><td>#{c.id}</td><td>{c.company_name}</td><td>{c.industry}</td><td>{c.location}</td><td>{c.username}</td></tr>)}
                        {data.length === 0 && <tr><td colSpan="5">No companies found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const AdminJobs = () => {
    const [data, setData] = useState([]);
    useEffect(() => { api.get('/jobs').then(r => setData(r.data)).catch(console.error); }, []);
    return (
        <div className="card">
            <h2 className="page-title mb-4 flex items-center gap-2"><Briefcase color="var(--accent-primary)" /> Platform Jobs</h2>
            <div className="table-container">
                <table className="premium-table">
                    <thead><tr><th>ID</th><th>Company</th><th>Role</th><th>Salary</th><th>Req. CGPA</th></tr></thead>
                    <tbody>
                        {data.map(j => <tr key={j.id}><td>#{j.id}</td><td>{j.company_name}</td><td>{j.role}</td><td>${j.salary}</td><td>{j.criteria_cgpa}</td></tr>)}
                        {data.length === 0 && <tr><td colSpan="5">No jobs found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const AdminPlacements = () => {
    const [data, setData] = useState([]);
    useEffect(() => { api.get('/placements').then(r => setData(r.data)).catch(console.error); }, []);
    return (
        <div className="card">
            <h2 className="page-title mb-4 flex items-center gap-2"><FileCheck color="var(--accent-primary)" /> Global Placements</h2>
            <div className="table-container">
                <table className="premium-table">
                    <thead><tr><th>Student</th><th>Company</th><th>Role</th><th>Status</th><th>Notes</th></tr></thead>
                    <tbody>
                        {data.map(p => (
                            <tr key={p.id}>
                                <td>{p.student_name} <br/><small className="text-muted">CGPA: {p.cgpa}</small></td>
                                <td>{p.company_name}</td>
                                <td>{p.job_role}</td>
                                <td><span className={`badge badge-${p.status === 'Applied' ? 'primary' : p.status === 'Selected' ? 'success' : 'warning'}`}>{p.status}</span></td>
                                <td>{p.description}</td>
                            </tr>
                        ))}
                        {data.length === 0 && <tr><td colSpan="5">No placements found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
