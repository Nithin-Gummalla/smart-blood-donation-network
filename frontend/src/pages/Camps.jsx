import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Tent, Calendar, Clock, MapPin, Phone, Plus, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Camps = () => {
  const { user } = useAuth();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    venue: '',
    city: 'New York',
    state: 'NY',
    campDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    contactPhone: '+1 800-555-0199'
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/camps');
      if (res.data.success) {
        setCamps(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch camps", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axiosClient.post('/camps', formData);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchCamps();
      }
    } catch (err) {
      alert("Failed to schedule camp: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>
            Blood Donation <span className="gradient-text">Camps</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Community blood drives and local donation camp schedules</p>
        </div>

        {(user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_HOSPITAL') && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Schedule Donation Camp
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading upcoming donation camps...</div>
      ) : camps.length > 0 ? (
        <div className="grid-cols-2">
          {camps.map((camp) => (
            <div key={camp.id} className="glass-panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(225,29,72,0.15)', padding: '0.75rem', borderRadius: '12px' }}>
                  <Tent size={26} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{camp.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organized by <strong>{camp.organizer}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--primary)" /> <strong>Venue:</strong> {camp.venue}, {camp.city}, {camp.state}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} color="var(--accent-blue)" /> <strong>Date:</strong> {camp.campDate}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} color="var(--accent-amber)" /> <strong>Timings:</strong> {camp.startTime} - {camp.endTime}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={16} color="var(--accent-green)" /> <strong>Contact:</strong> {camp.contactPhone}
                </div>
              </div>

              <button onClick={() => alert(`Registered for ${camp.title}! A reminder notification has been scheduled.`)} className="btn btn-primary" style={{ width: '100%' }}>
                <CheckCircle2 size={16} /> Register as Donor for Camp
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3>No upcoming camps scheduled</h3>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Blood Donation Camp">
        <form onSubmit={handleCreateCamp}>
          <div className="form-group">
            <label className="form-label">Camp Event Title</label>
            <input type="text" required className="form-control" placeholder="Summer Health Blood Drive" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Organizer Name</label>
            <input type="text" required className="form-control" placeholder="Red Cross Society" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Venue / Hall Address</label>
            <input type="text" required className="form-control" placeholder="Civic Center, Main Hall" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" required className="form-control" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" required className="form-control" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            </div>
          </div>

          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">Camp Date</label>
              <input type="date" required className="form-control" value={formData.campDate} onChange={(e) => setFormData({ ...formData, campDate: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="text" required className="form-control" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input type="text" required className="form-control" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {submitting ? 'Publishing...' : 'Publish Donation Camp'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
