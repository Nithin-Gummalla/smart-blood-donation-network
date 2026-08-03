import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Shield, Users, Trash2, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';

export const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        const res = await axiosClient.delete(`/admin/users/${id}`);
        if (res.data.success) {
          fetchUsers();
        }
      } catch (err) {
        alert("Failed to delete user: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield color="var(--accent-amber)" /> System Admin <span className="gradient-text">Console</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage user accounts, roles, access permissions, and system nodes</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>
          Registered Network Users ({users.length})
        </h3>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading network user directory...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>ID</th>
                  <th style={{ padding: '0.75rem' }}>Full Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Phone</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Registered At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '700' }}>#{u.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>{u.fullName}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-emergency' : u.role === 'ROLE_HOSPITAL' ? 'badge-info' : 'badge-success'}`}>
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', color: '#fb7185' }}
                          title="Delete User"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
