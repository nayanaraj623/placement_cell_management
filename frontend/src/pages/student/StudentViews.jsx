import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Mail, Award, BookOpen } from 'lucide-react';

export const StudentProfile = () => {
    const { user } = useAuth();
    const p = user?.profile || {};

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="text-center mb-4">
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)'
                }}>
                    <User size={40} color="white" />
                </div>
                <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>{p.name || user.username}</h2>
                <p style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Student Profile</p>
            </div>

            <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0' }} />

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div className="flex items-center gap-3" style={{ padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <Mail color="var(--text-muted)" />
                    <div><small className="text-muted block">Email Address</small><strong>{p.email || 'N/A'}</strong></div>
                </div>
                <div className="flex items-center gap-3" style={{ padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <BookOpen color="var(--text-muted)" />
                    <div><small className="text-muted block">Department</small><strong>{p.dept || 'N/A'}</strong></div>
                </div>
                <div className="flex items-center gap-3" style={{ padding: '0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <Award color="var(--text-muted)" />
                    <div><small className="text-muted block">CGPA</small><strong>{p.cgpa || 'N/A'}</strong></div>
                </div>
            </div>
            
            <div className="mt-4 text-center">
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    Profile updates must be requested through your Placement Officer.
                </p>
            </div>
        </div>
    );
};
