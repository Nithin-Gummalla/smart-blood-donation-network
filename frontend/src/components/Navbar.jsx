import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Droplet, HeartHandshake, Search, Activity, Package, Tent, Shield, Sun, Moon, LogOut, User, Menu, X, Bell } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)'
          }}>
            <Droplet size={26} color="#ffffff" fill="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Smart<span className="gradient-text">Blood</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Donation Network
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-links">
          <Link to="/" className={`btn btn-secondary ${isActive('/') ? 'active-nav' : ''}`} style={{ background: 'transparent', border: 'none' }}>
            Home
          </Link>
          <Link to="/search" className="btn btn-secondary" style={{ background: 'transparent', border: 'none', gap: '0.4rem' }}>
            <Search size={16} /> Find Donors
          </Link>
          <Link to="/requests" className="btn btn-secondary" style={{ background: 'transparent', border: 'none', gap: '0.4rem' }}>
            <Activity size={16} /> Requests
          </Link>
          <Link to="/camps" className="btn btn-secondary" style={{ background: 'transparent', border: 'none', gap: '0.4rem' }}>
            <Tent size={16} /> Camps
          </Link>
          <Link to="/inventory" className="btn btn-secondary" style={{ background: 'transparent', border: 'none', gap: '0.4rem' }}>
            <Package size={16} /> Stock
          </Link>

          {user && (
            <Link to="/dashboard" className="btn btn-secondary" style={{ background: 'transparent', border: 'none' }}>
              Dashboard
            </Link>
          )}

          {user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin" className="btn btn-secondary" style={{ background: 'transparent', border: 'none', gap: '0.4rem', color: 'var(--accent-amber)' }}>
              <Shield size={16} /> Admin
            </Link>
          )}
        </div>

        {/* Actions & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#38bdf8" />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" className="btn btn-secondary" style={{ gap: '0.5rem', background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
                <User size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.fullName || 'User'}</span>
                <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{user.role?.replace('ROLE_', '')}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.55rem', borderRadius: '8px' }} title="Logout">
                <LogOut size={18} color="var(--primary)" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
