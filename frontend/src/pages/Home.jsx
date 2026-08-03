import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Droplet, Search, ShieldAlert, HeartHandshake, Award, Users, Building, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';

export const Home = () => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [stockSummary, setStockSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, stockRes] = await Promise.all([
          axiosClient.get('/blood-requests/public/active'),
          axiosClient.get('/inventory/public/summary')
        ]);
        if (reqRes.data.success) setActiveRequests(reqRes.data.data.slice(0, 3));
        if (stockRes.data.success) setStockSummary(stockRes.data.data);
      } catch (err) {
        console.error("Home data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Banner Section */}
      <section style={{ position: 'relative', padding: '5rem 0 4rem 0', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(225,29,72,0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: -1
        }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div className="badge badge-emergency" style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem' }}>
                <Activity size={14} className="animate-pulse-glow" /> Real-time Blood Donation Network
              </div>
              <h1 style={{ fontSize: '3.2rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '1.5rem' }}>
                Connecting Donors & Emergency Patients <span className="gradient-text">Instantly.</span>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.25rem', lineHeight: '1.7', maxWidth: '600px' }}>
                Smart Blood Network accelerates emergency blood matching with verified donors, hospital stock tracking, and automated eligibility algorithms. One donation can save up to 3 lives.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/search" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                  <Search size={18} /> Find Donors Now
                </Link>
                <Link to="/requests" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                  <ShieldAlert size={18} color="var(--primary)" /> Request Emergency Blood
                </Link>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>100%</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Hospitals</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-green)' }}>&lt; 15 mins</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Response Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-blue)' }}>24 / 7</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency Support</div>
                </div>
              </div>
            </div>

            {/* Live Stock Ticker Card */}
            <div className="glass-panel animate-float" style={{ padding: '2rem', border: '1px solid rgba(225,29,72,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Droplet size={20} color="var(--primary)" fill="var(--primary)" />
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Live Blood Group Stock</span>
                </div>
                <span className="badge badge-success">Updated Live</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                {Object.keys(stockSummary).length > 0 ? (
                  Object.entries(stockSummary).map(([bg, units]) => (
                    <div key={bg} style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: units < 5 ? '1px solid rgba(225,29,72,0.5)' : '1px solid var(--border-color)'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>{bg}</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0.2rem 0' }}>{units}</div>
                      <div style={{ fontSize: '0.65rem', color: units < 5 ? '#fb7185' : 'var(--text-dim)', fontWeight: '600' }}>
                        {units < 5 ? 'LOW STOCK' : 'UNITS'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: 'span 4', color: 'var(--text-muted)', padding: '1rem' }}>
                    Loading stock summary...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Emergency Requests Section */}
      {activeRequests.length > 0 && (
        <section style={{ padding: '3rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>
                  Urgent Emergency <span className="gradient-text">Requests</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Patients requiring immediate blood transfusion right now</p>
              </div>
              <Link to="/requests" className="btn btn-outline" style={{ gap: '0.4rem' }}>
                View All Requests <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-cols-3">
              {activeRequests.map((req) => (
                <div key={req.id} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span className="badge badge-emergency" style={{ fontSize: '0.7rem' }}>{req.emergencyLevel} PRIORITY</span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '0.5rem' }}>{req.patientName}</h3>
                    </div>
                    <div style={{
                      background: 'rgba(225,29,72,0.15)',
                      color: 'var(--primary)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '1.1rem',
                      border: '1px solid rgba(225,29,72,0.3)'
                    }}>
                      {req.bloodGroup}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <div>🏥 <strong>Hospital:</strong> {req.hospitalName}</div>
                    <div>📍 <strong>Location:</strong> {req.city}, {req.state}</div>
                    <div>🩸 <strong>Units Needed:</strong> {req.unitsRequired} Units</div>
                  </div>

                  <Link to="/requests" className="btn btn-primary" style={{ width: '100%' }}>
                    Respond & Donate
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Feature Highlights Grid */}
      <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Designed for Speed, Security & Impact</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Our full-stack platform powers blood donation networks across hospitals and donors seamlessly.</p>
          </div>

          <div className="grid-cols-3">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ background: 'rgba(225,29,72,0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Search size={26} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Smart Donor Search</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Filter donors by blood group, city, state, and real-time eligibility availability status with instant contact info.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ background: 'rgba(56,189,248,0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Building size={26} color="var(--accent-blue)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hospital Stock Control</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Hospitals manage central inventory, track unit expiry dates, trigger low-stock alerts, and approve blood requests.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ background: 'rgba(16,185,129,0.15)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Award size={26} color="var(--accent-green)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Donor Eligibility Tracking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Automated 90-day donation interval logic ensures donor safety and sends automated eligibility reminders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
