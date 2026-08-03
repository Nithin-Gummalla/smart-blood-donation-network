import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Package, AlertTriangle, Plus, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Stock Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('A+');
  const [unitsAvailable, setUnitsAvailable] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/inventory');
      if (res.data.success) {
        setInventory(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        bloodGroup: selectedGroup,
        unitsAvailable: parseInt(unitsAvailable)
      };
      const res = await axiosClient.post('/inventory', payload);
      if (res.data.success) {
        setIsModalOpen(false);
        fetchInventory();
      }
    } catch (err) {
      alert("Failed to update stock: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const openUpdateModal = (item) => {
    setSelectedGroup(item.bloodGroup);
    setUnitsAvailable(item.unitsAvailable);
    setIsModalOpen(true);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800' }}>
            Blood Stock <span className="gradient-text">Inventory</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Hospital & Central Blood Bank stock availability matrix</p>
        </div>

        {(user?.role === 'ROLE_HOSPITAL' || user?.role === 'ROLE_ADMIN') && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} /> Update Stock Unit Level
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching live blood stock levels...</div>
      ) : (
        <div className="grid-cols-4">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
            const item = inventory.find(i => i.bloodGroup === bg) || { bloodGroup: bg, unitsAvailable: 0, isLowStock: true };
            const isLow = item.unitsAvailable < 5;

            return (
              <div key={bg} className="glass-panel" style={{
                padding: '1.5rem',
                position: 'relative',
                border: isLow ? '1px solid rgba(225,29,72,0.4)' : '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>{bg}</span>
                  {isLow ? (
                    <span className="badge badge-emergency" style={{ fontSize: '0.65rem' }}>
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  ) : (
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                      <CheckCircle2 size={12} /> Healthy Stock
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {item.unitsAvailable} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Units</span>
                </div>

                {/* Progress bar visual indicator */}
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: `${Math.min(100, (item.unitsAvailable / 30) * 100)}%`,
                    height: '100%',
                    background: isLow ? 'linear-gradient(90deg, #e11d48, #fb7185)' : 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease-in-out'
                  }} />
                </div>

                {(user?.role === 'ROLE_HOSPITAL' || user?.role === 'ROLE_ADMIN') && (
                  <button onClick={() => openUpdateModal(item)} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                    <RefreshCw size={14} /> Adjust Count
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Blood Bank Stock">
        <form onSubmit={handleUpdateStock}>
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select className="form-control" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Units Available Count</label>
            <input type="number" min="0" max="500" className="form-control" value={unitsAvailable} onChange={(e) => setUnitsAvailable(e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {submitting ? 'Saving...' : 'Save Stock Quantity'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
