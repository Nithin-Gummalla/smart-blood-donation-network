import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Search, Filter, Phone, MapPin, CheckCircle2, XCircle, Droplet, User, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';

export const DonorSearch = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Contact Modal
  const [selectedDonor, setSelectedDonor] = useState(null);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (city) params.city = city;
      if (state) params.state = state;
      if (isAvailable !== null) params.isAvailable = isAvailable;

      const res = await axiosClient.get('/donors/search', { params });
      if (res.data.success) {
        setDonors(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch donors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
        <div className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
          <Search size={14} /> Search Network Database
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>
          Find Eligible Blood Donors <span className="gradient-text">Nearby</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Filter active, verified blood donors by location and blood group for urgent medical requirements.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Blood Group</label>
            <select className="form-control" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
              <option value="">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City</label>
            <input type="text" className="form-control" placeholder="e.g. New York" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">State</label>
            <input type="text" className="form-control" placeholder="e.g. NY" value={state} onChange={(e) => setState(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Availability</label>
            <select className="form-control" value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === 'true')}>
              <option value="true">Available Now</option>
              <option value="false">All Statuses</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Search size={18} /> Apply Filters
          </button>
        </form>
      </div>

      {/* Donors Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Searching registered blood donors...</div>
      ) : donors.length > 0 ? (
        <div className="grid-cols-3">
          {donors.map((d) => (
            <div key={d.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.65rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <User size={24} color="var(--accent-blue)" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{d.fullName}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} color="var(--primary)" /> {d.city}, {d.state}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                    color: '#ffffff',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '10px',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    boxShadow: '0 0 15px rgba(225,29,72,0.3)'
                  }}>
                    {d.bloodGroup}
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <div>🎂 <strong>Age:</strong> {d.age} years ({d.gender})</div>
                  <div>📅 <strong>Last Donated:</strong> {d.lastDonationDate || 'No record logged'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    ⚡ <strong>Status:</strong>
                    {d.isAvailable ? (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}><CheckCircle2 size={12} /> Available</span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}><XCircle size={12} /> Unavailable</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDonor(d)}
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                <Phone size={16} /> Contact Donor
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={36} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
          <h3>No matching donors found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.35rem' }}>Try clearing location filters or selecting a different blood group.</p>
        </div>
      )}

      {/* Donor Contact Modal */}
      <Modal isOpen={!!selectedDonor} onClose={() => setSelectedDonor(null)} title="Donor Contact Information">
        {selectedDonor && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#fff',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '0.5rem'
              }}>
                {selectedDonor.bloodGroup}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedDonor.fullName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Verified Smart Blood Donor</p>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div>📞 <strong>Phone:</strong> <a href={`tel:${selectedDonor.phone}`} style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '700' }}>{selectedDonor.phone || 'Contact via email'}</a></div>
              <div>✉️ <strong>Email:</strong> {selectedDonor.email}</div>
              <div>📍 <strong>Address:</strong> {selectedDonor.address || 'Address withheld'}, {selectedDonor.city}, {selectedDonor.state} {selectedDonor.pincode}</div>
            </div>

            <button onClick={() => setSelectedDonor(null)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1.25rem' }}>
              Close Window
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
