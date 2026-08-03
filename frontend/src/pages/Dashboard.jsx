import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { StatsCard } from '../components/StatsCard';
import { Users, Droplet, Activity, CheckCircle2, ShieldAlert, Package, Calendar, Award, Building, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        let endpoint = '/dashboard/donor';
        if (user?.role === 'ROLE_ADMIN') endpoint = '/dashboard/admin';
        else if (user?.role === 'ROLE_HOSPITAL') endpoint = '/dashboard/hospital';

        const res = await axiosClient.get(endpoint);
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDashboard();
  }, [user]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Dashboard Metrics...</div>;
  }

  // ADMIN DASHBOARD VIEW
  if (user?.role === 'ROLE_ADMIN') {
    return (
      <div className="container" style={{ padding: '2.5rem 0' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
            System Administration <span className="gradient-text">Overview</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time statistics across the Smart Blood Donation Network</p>
        </div>

        <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          <StatsCard title="Total Donors" value={stats?.totalDonors || 0} icon={Users} color="var(--accent-blue)" subtitle={`${stats?.activeDonors || 0} Active & Available`} />
          <StatsCard title="Hospitals" value={stats?.totalHospitals || 0} icon={Building} color="var(--accent-purple)" subtitle="Verified Medical Nodes" />
          <StatsCard title="Blood Requests" value={stats?.totalBloodRequests || 0} icon={Activity} color="var(--primary)" subtitle={`${stats?.pendingRequests || 0} Pending Queue`} />
          <StatsCard title="Fulfilled Requests" value={stats?.fulfilledRequests || 0} icon={CheckCircle2} color="var(--accent-green)" subtitle="Successful Transfusions" />
        </div>

        {/* Global Inventory Distribution & Stock Matrix */}
        <div className="grid-cols-2">
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>Network Stock Breakdown</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {stats?.inventoryByBloodGroup && Object.entries(stats.inventoryByBloodGroup).map(([bg, units]) => (
                <div key={bg} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: units < 5 ? '1px solid #e11d48' : '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>{bg}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0.2rem 0' }}>{units}</div>
                  <span style={{ fontSize: '0.7rem', color: units < 5 ? '#fb7185' : 'var(--text-dim)', fontWeight: '700' }}>
                    {units < 5 ? 'CRITICAL' : 'UNITS'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>Quick Admin Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/admin" className="btn btn-primary" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <Users size={18} /> Manage Registered Users
              </Link>
              <Link to="/inventory" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <Package size={18} /> Adjust Inventory & Expired Units
              </Link>
              <Link to="/camps" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '0.85rem' }}>
                <Calendar size={18} /> Schedule Donation Camp
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DONOR DASHBOARD VIEW
  if (user?.role === 'ROLE_DONOR') {
    return (
      <div className="container" style={{ padding: '2.5rem 0' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
            Welcome back, <span className="gradient-text">{stats?.profile?.fullName || 'Hero Donor'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Thank you for saving lives in our network.</p>
        </div>

        <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
          <StatsCard title="Profile Status" value={`${stats?.profileCompletionPercentage || 0}%`} icon={Award} color="var(--accent-blue)" subtitle="Complete profile to receive alert match" />
          <StatsCard title="Total Donations" value={stats?.totalDonationsCount || 0} icon={Droplet} color="var(--primary)" subtitle="Lifesaving units donated" />
          <StatsCard
            title="Eligibility"
            value={stats?.isEligibleToDonate ? 'ELIGIBLE NOW' : 'WAITING PERIOD'}
            icon={CheckCircle2}
            color={stats?.isEligibleToDonate ? 'var(--accent-green)' : 'var(--accent-amber)'}
            subtitle={stats?.nextEligibleDate ? `Next date: ${stats.nextEligibleDate}` : 'Ready to donate'}
          />
        </div>

        <div className="grid-cols-2">
          {/* Nearby Urgent Requests */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert color="var(--primary)" /> Urgent Matching Requests
            </h3>
            {stats?.nearbyUrgentRequests?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.nearbyUrgentRequests.map((req) => (
                  <div key={req.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '700' }}>{req.patientName} ({req.bloodGroup})</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.hospitalName} • {req.city}</div>
                    </div>
                    <Link to="/requests" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                      Respond
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No urgent requests currently matching your region.</p>
            )}
          </div>

          {/* Quick Profile Controls */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>My Donor Card</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div>🩸 <strong>Blood Group:</strong> {stats?.profile?.bloodGroup || 'Not specified'}</div>
              <div>📍 <strong>City/State:</strong> {stats?.profile?.city}, {stats?.profile?.state}</div>
              <div>📅 <strong>Last Donation Date:</strong> {stats?.profile?.lastDonationDate || 'No record'}</div>
              <div>⚡ <strong>Availability Status:</strong> {stats?.profile?.isAvailable ? 'Available for calls' : 'Unavailable'}</div>
            </div>
            <Link to="/profile" className="btn btn-secondary" style={{ width: '100%' }}>
              Edit Donor Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // HOSPITAL DASHBOARD VIEW
  return (
    <div className="container" style={{ padding: '2.5rem 0' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
          Hospital Portal - <span className="gradient-text">{stats?.profile?.hospitalName || 'Medical Center'}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage hospital blood requests and central blood bank inventory</p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <StatsCard title="Active Requests" value={stats?.activeRequestsCount || 0} icon={Activity} color="var(--primary)" subtitle="Pending patient transfusions" />
        <StatsCard title="Approved Requests" value={stats?.approvedRequestsCount || 0} icon={CheckCircle2} color="var(--accent-green)" subtitle="Fulfilled / Verified" />
        <StatsCard title="Units in Bank" value={stats?.totalBloodUnitsInStock || 0} icon={Package} color="var(--accent-blue)" subtitle="Total blood units available" />
      </div>

      <div className="grid-cols-2">
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Active Blood Request Queue</h3>
            <Link to="/requests" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
              + Create Request
            </Link>
          </div>
          {stats?.pendingRequests?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.pendingRequests.map((req) => (
                <div key={req.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700' }}>{req.patientName} — {req.bloodGroup} ({req.unitsRequired} Units)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.emergencyLevel} Priority • Needed by {req.requiredDate}</div>
                  </div>
                  <Link to="/requests" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                    View & Approve
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active requests in queue.</p>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem' }}>Inventory Quick Action</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Ensure your hospital's stock count is accurate to alert nearby donors when inventory drops below critical thresholds.
          </p>
          <Link to="/inventory" className="btn btn-primary" style={{ width: '100%' }}>
            Manage Hospital Stock
          </Link>
        </div>
      </div>
    </div>
  );
};
