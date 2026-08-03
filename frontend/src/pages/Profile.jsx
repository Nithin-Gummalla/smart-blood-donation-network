import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(user?.profileDetails || {});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    bloodGroup: profile?.bloodGroup || 'O+',
    age: profile?.age || 25,
    gender: profile?.gender || 'Male',
    city: profile?.city || 'New York',
    state: profile?.state || 'NY',
    address: profile?.address || '',
    isAvailable: profile?.isAvailable ?? true,
    lastDonationDate: profile?.lastDonationDate || '',
    hospitalName: profile?.hospitalName || '',
    licenseNumber: profile?.licenseNumber || '',
    contactNumber: profile?.contactNumber || ''
  });

  useEffect(() => {
    if (user?.profileDetails) {
      setProfile(user.profileDetails);
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        phone: user.phone || prev.phone,
        ...user.profileDetails
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      let endpoint = '/donors/profile';
      if (user?.role === 'ROLE_HOSPITAL') endpoint = '/hospitals/profile';

      const res = await axiosClient.put(endpoint, formData);
      if (res.data.success) {
        setMessage('Profile updated successfully!');
        updateUserProfile(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{user?.fullName}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email} • <span className="badge badge-info">{user?.role?.replace('ROLE_', '')}</span></p>
            </div>
          </div>

          {message && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> <span>{message}</span>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            {user?.role === 'ROLE_DONOR' && (
              <>
                <div className="grid-cols-3">
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-control" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-control" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <select className="form-control" value={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}>
                      <option value="true">Available to Donate</option>
                      <option value="false">Currently Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Last Donation Date</label>
                  <input type="date" className="form-control" value={formData.lastDonationDate || ''} onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })} />
                </div>
              </>
            )}

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-control" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" className="form-control" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Save size={18} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
