import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{
        background: `rgba(255, 255, 255, 0.05)`,
        border: `1px solid ${color}40`,
        padding: '0.85rem',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {Icon && <Icon size={28} color={color} />}
      </div>
      <div>
        <span style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.1rem 0' }}>
          {value}
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
