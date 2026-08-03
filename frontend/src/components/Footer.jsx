import React from 'react';
import { Droplet, Heart, Shield, PhoneCall, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: '4rem',
      background: 'rgba(11, 15, 25, 0.95)',
      borderTop: '1px solid var(--border-color)',
      padding: '3rem 0 1.5rem 0'
    }}>
      <div className="container">
        <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Droplet size={22} color="var(--primary)" fill="var(--primary)" />
              <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                Smart<span className="gradient-text">Blood</span> Network
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Connecting lifesaving blood donors with hospitals and critical emergency patients in real-time. Built with intelligent matching algorithms and verified medical networks.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/search" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Find Donors</Link>
              <Link to="/requests" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Blood Requests</Link>
              <Link to="/camps" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Donation Camps</Link>
              <Link to="/inventory" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>Stock Availability</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>Support & Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>24/7 Emergency Hotline</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Donor Eligibility Guidelines</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Privacy & Data Protection</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Hospital Registration Terms</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>Emergency Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={16} color="var(--primary)" />
                <span>1-800-SMART-BLOOD (762-782)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--accent-blue)" />
                <span>emergency@smartblood.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-green)" />
                <span>Global Medical Operations HQ</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-dim)'
        }}>
          <span>&copy; {new Date().getFullYear()} Smart Blood Donation Network. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Made with <Heart size={14} color="var(--primary)" fill="var(--primary)" /> to save lives worldwide.
          </span>
        </div>
      </div>
    </footer>
  );
};
