import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Plus, Activity, CheckCircle2, Clock, XCircle, Building, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '../components/Modal';

export const BloodRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Create Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'A+',
    unitsRequired: 1,
    emergencyLevel: 'HIGH',
    hospitalName: '',
    city: 'New York',
    state: 'NY',
    requiredDate: new Date().toISOString().split('T')[0]
  });

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint = filterStatus ? `/blood-requests?status=${filterStatus}` : '/blood-requests';
      const res = await axiosClient.get(endpoint);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch blood requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      const res = await axiosClient.post('/blood-requests', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        setFormData({
          patientName: '',
          bloodGroup: 'A+',
          unitsRequired: 1,
          emergencyLevel: 'HIGH',
          hospitalName: '',
          city: 'New York',
          state: 'NY',
          requiredDate: new Date().toISOString().split('T')[0]
        });
        fetchRequests();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus, currentFulfilled) => {
    try {
      const payload = { status: newStatus, unitsFulfilled: currentFulfilled };
      const res = await axiosClient.put(`/blood-requests/${requestId}/status`, payload);
      if (res.data.success) {
        fetchRequests();
      }
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>
            Blood Donation <span className="gradient-text">Requests</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Emergency transfusion requests & patient fulfillment tracking</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select className="form-control" style={{ width: '180px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {user && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <Plus size={18} /> Submit Blood Request
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading active blood requests...</div>
      ) : requests.length > 0 ? (
        <div className="grid-cols-2">
          {requests.map((req) => (
            <div key={req.id} className="glass-panel" style={{
              padding: '1.75rem',
              borderLeft: req.emergencyLevel === 'CRITICAL' ? '5px solid #e11d48' : '5px solid var(--accent-blue)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span className={`badge ${req.emergencyLevel === 'CRITICAL' ? 'badge-emergency' : 'badge-info'}`}>
                    {req.emergencyLevel} EMERGENCY
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.4rem' }}>{req.patientName}</h3>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                  color: '#ffffff',
                  padding: '0.45rem 1rem',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '1.25rem',
                  boxShadow: '0 0 15px rgba(225,29,72,0.3)'
                }}>
                  {req.bloodGroup}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <div>🏥 <strong>Hospital:</strong> {req.hospitalName}</div>
                <div>📍 <strong>Location:</strong> {req.city}, {req.state}</div>
                <div>🩸 <strong>Units:</strong> {req.unitsFulfilled} / {req.unitsRequired} Units</div>
                <div>📅 <strong>Needed By:</strong> {req.requiredDate}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span className={`badge ${req.status === 'FULFILLED' ? 'badge-success' : req.status === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>
                  Status: {req.status}
                </span>

                {/* Hospital / Admin Action Controls */}
                {(user?.role === 'ROLE_HOSPITAL' || user?.role === 'ROLE_ADMIN') && req.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleStatusUpdate(req.id, 'APPROVED', req.unitsRequired)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                    >
                      Approve & Fulfill
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={36} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
          <h3>No blood requests found</h3>
        </div>
      )}

      {/* Modal to Create New Blood Request */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Emergency Blood Request">
        {formError && (
          <div style={{ background: 'rgba(225, 29, 72, 0.15)', color: '#fb7185', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label className="form-label">Patient Name</label>
            <input type="text" required className="form-control" placeholder="Jane Doe" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Blood Group Required</label>
              <select className="form-control" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Units Needed</label>
              <input type="number" min="1" max="20" className="form-control" value={formData.unitsRequired} onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value) })} />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Emergency Priority</label>
              <select className="form-control" value={formData.emergencyLevel} onChange={(e) => setFormData({ ...formData, emergencyLevel: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date Required By</label>
              <input type="date" required className="form-control" value={formData.requiredDate} onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hospital / Clinic Name</label>
            <input type="text" required className="form-control" placeholder="St. Jude Hospital" value={formData.hospitalName} onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })} />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" required className="form-control" placeholder="New York" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" required className="form-control" placeholder="NY" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {submitting ? 'Submitting Request...' : 'Publish Blood Request'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
