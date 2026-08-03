import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, User, Mail, Lock, Phone, MapPin, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('ROLE_DONOR');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'O+',
    age: 25,
    gender: 'Male',
    city: 'New York',
    state: 'NY',
    address: '',
    hospitalName: '',
    licenseNumber: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = { ...formData, role };
      await register(payload);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check form details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 160px)', padding: '2.5rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            <Droplet size={26} color="#ffffff" fill="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Join the Smart Blood Donation Network</p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setRole('ROLE_DONOR')}
            className="btn"
            style={{
              flex: 1,
              background: role === 'ROLE_DONOR' ? 'var(--primary)' : 'transparent',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}
          >
            Individual Donor
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_HOSPITAL')}
            className="btn"
            style={{
              flex: 1,
              background: role === 'ROLE_HOSPITAL' ? 'var(--primary)' : 'transparent',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}
          >
            Hospital / Clinic
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.4)', color: '#fb7185', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">{role === 'ROLE_HOSPITAL' ? 'Contact Representative Name' : 'Full Name'}</label>
              <input type="text" name="fullName" required className="form-control" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" required className="form-control" placeholder="name@example.com" value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" required className="form-control" placeholder="Minimum 6 chars" value={formData.password} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" name="phone" required className="form-control" placeholder="+1 555-0199" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          {role === 'ROLE_DONOR' && (
            <>
              <div className="grid-cols-3">
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" name="age" min="18" max="65" className="form-control" value={formData.age} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {role === 'ROLE_HOSPITAL' && (
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input type="text" name="hospitalName" required className="form-control" placeholder="City Hospital" value={formData.hospitalName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Medical License Number</label>
                <input type="text" name="licenseNumber" required className="form-control" placeholder="LIC-99823" value={formData.licenseNumber} onChange={handleChange} />
              </div>
            </div>
          )}

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" required className="form-control" placeholder="New York" value={formData.city} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" required className="form-control" placeholder="NY" value={formData.state} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
