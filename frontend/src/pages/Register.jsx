import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Key, Mail, GraduationCap, Building } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role_name: 'Student', // Default
    name: '',
    email: '',
    dept: '',
    cgpa: '',
    company_name: '',
    industry: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
        username: formData.username,
        password: formData.password,
        role_name: formData.role_name
    };

    if (formData.role_name === 'Student') {
        Object.assign(payload, {
            name: formData.name,
            email: formData.email,
            dept: formData.dept,
            cgpa: parseFloat(formData.cgpa) || 0
        });
    } else if (formData.role_name === 'Company') {
        Object.assign(payload, {
            company_name: formData.company_name,
            industry: formData.industry,
            location: formData.location
        });
    }

    const result = await register(payload);
    
    if (result.success) {
      alert("Registration successful! You can now log in.");
      navigate('/login'); 
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-wrapper" style={{ padding: '2rem 0' }}>
      <div className="glass-panel auth-card" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <UserPlus size={32} color="white" />
          </div>
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the Placement Cell Portal</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">I am applying as a:</label>
            <select 
              className="form-control" 
              name="role_name" 
              value={formData.role_name} 
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Company">Company</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                <input type="text" className="form-control" name="username" placeholder="johndoe123" style={{ paddingLeft: '2.5rem' }} value={formData.username} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                <input type="password" className="form-control" name="password" placeholder="••••••••" style={{ paddingLeft: '2.5rem' }} value={formData.password} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0' }} />

          {/* Dynamic Fields based on Role */}
          {formData.role_name === 'Student' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                  <input type="text" className="form-control" name="name" placeholder="John Doe" style={{ paddingLeft: '2.5rem' }} value={formData.name} onChange={handleChange} required />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                  <input type="email" className="form-control" name="email" placeholder="john@example.com" style={{ paddingLeft: '2.5rem' }} value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div style={{ position: 'relative' }}>
                    <Building size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                    <input type="text" className="form-control" name="dept" placeholder="Computer Science" style={{ paddingLeft: '2.5rem' }} value={formData.dept} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">CGPA</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                    <input type="number" step="0.01" className="form-control" name="cgpa" placeholder="8.5" style={{ paddingLeft: '2.5rem' }} value={formData.cgpa} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </>
          )}

          {formData.role_name === 'Company' && (
            <>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                  <input type="text" className="form-control" name="company_name" placeholder="Acme Corp" style={{ paddingLeft: '2.5rem' }} value={formData.company_name} onChange={handleChange} required />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input type="text" className="form-control" name="industry" placeholder="Technology" value={formData.industry} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" name="location" placeholder="New York, NY" value={formData.location} onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary mt-2" 
            style={{ width: '100%', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
