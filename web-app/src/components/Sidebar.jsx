import React from 'react';
import { LayoutDashboard, Video, Code, BarChart3, Layers, FileText, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'interview-setup', label: 'AI Mock Interview', icon: Video, badge: 'Live AI' },
    { id: 'coding', label: 'Coding Workspace', icon: Code },
    { id: 'analytics', label: 'Score & Analytics', icon: BarChart3 },
    { id: 'flashcards', label: 'Smart Flashcards', icon: Layers },
    { id: 'resume', label: 'Resume ATS Parser', icon: FileText },
  ];

  return (
    <aside style={{
      width: '250px',
      borderRight: '1px solid var(--border-glass)',
      background: 'rgba(10, 15, 29, 0.6)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: '72px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '0 12px 12px 12px'
        }}>
          Navigation Menu
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                color: isActive ? '#FFF' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-glass)';
              }}
              onMouseOut={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-teal)',
                  color: '#0A0F1D'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Preferences / Settings */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          width: '100%',
          borderRadius: 'var(--radius-md)',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer'
        }}>
          <Settings size={18} />
          <span>App Preferences</span>
        </button>
      </div>
    </aside>
  );
}
