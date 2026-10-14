import React, { useState, useRef, useEffect } from 'react';
import { Flame, Search, Sparkles, LogOut, ChevronDown, Mail, Award, Clock, TrendingUp, Settings, HelpCircle, Moon, Bell } from 'lucide-react';
import { analyticsApi } from '../services/api';

export default function Navbar({ streakCount = 7, onStartInterview, user, onLogout, isDarkMode, toggleTheme }) {
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'CK';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [profileStats, setProfileStats] = useState({ interviews: 0, avgScore: 0, practiceHrs: 0 });
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real user stats for profile dropdown
  useEffect(() => {
    let mounted = true;
    const userEmail = user?.email || 'default';
    const storageKey = `prepwise_interviews_${userEmail}`;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const list = JSON.parse(saved);
        if (list && list.length > 0) {
          const total = list.length;
          const avg = Math.round(list.reduce((sum, i) => sum + (Number(i.score) || 0), 0) / total);
          const totalMins = list.reduce((sum, i) => sum + (Number(i.duration_minutes) || 30), 0);
          const hrs = (totalMins / 60).toFixed(1);
          setProfileStats({
            interviews: total,
            avgScore: avg,
            practiceHrs: hrs.endsWith('.0') ? hrs.slice(0, -2) : hrs
          });
        }
      }
    } catch (e) {}

    analyticsApi.summary().then(data => {
      if (!mounted) return;
      if (data) {
        setProfileStats(prev => ({ 
          interviews: Math.max(prev.interviews, data.totalInterviews || 0), 
          avgScore: prev.interviews > (data.totalInterviews || 0) ? prev.avgScore : (data.avgScore || 0), 
          practiceHrs: prev.interviews > (data.totalInterviews || 0) ? prev.practiceHrs : (data.practiceHours || '0') 
        }));
      }
    }).catch(err => console.error('Failed to load profile stats', err));
    return () => { mounted = false; };
  }, [user?.email]);

  return (
    <header style={{
      height: '72px',
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(10, 15, 29, 0.8)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={22} color="#FFF" />
        </div>
        <div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            PrepWise<span className="gradient-text">AI</span>
          </span>
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              AI Interview Suite
            </span>
            <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontWeight: '700', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
              🦙 Meta LLaMA 3.1
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hide-mobile" style={{ position: 'relative', width: '380px', display: 'flex', alignItems: 'center' }}>
        <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
        <input
          type="text"
          placeholder="Search interview topics, algorithms, system design..."
          style={{
            width: '100%', padding: '10px 16px 10px 40px', borderRadius: 'var(--radius-full)',
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
            color: 'var(--text-main)', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-sans)'
          }}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Streak Badge */}
        <div className="hide-mobile" style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
          borderRadius: 'var(--radius-full)', background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--accent-amber)',
          fontSize: '13px', fontWeight: '700'
        }}>
          <Flame size={18} fill="currentColor" />
          <span>{streakCount} Day Streak</span>
        </div>

        {/* Quick Launch CTA */}
        <button
          className="hide-mobile"
          onClick={onStartInterview}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: '#FFF', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}
        >
          <Sparkles size={16} />
          <span>Start AI Mock Interview</span>
        </button>

        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: isNotifOpen ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-glass)', 
            border: isNotifOpen ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-glass)',
            color: isNotifOpen ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative', transition: 'var(--transition-fast)'
          }}>
            <Bell size={17} />
            <div style={{
              position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px',
              borderRadius: '50%', background: '#EF4444'
            }} />
          </button>

          {isNotifOpen && (
            <div className="glass-panel" style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '320px',
              padding: '16px', borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              zIndex: 100
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Notifications</span>
                <span style={{ fontSize: '10px', color: 'var(--primary)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', marginTop: '6px' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>Your session report is ready</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>System Design & HashMap • 2m ago</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'transparent', marginTop: '6px' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700' }}>Welcome to PrepWiseAI!</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Start your first mock interview • 1h ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar + Dropdown Trigger */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
              padding: '4px 8px 4px 4px', borderRadius: 'var(--radius-md)',
              background: isProfileOpen ? 'var(--bg-glass)' : 'transparent',
              border: isProfileOpen ? '1px solid var(--border-glow)' : '1px solid transparent',
              transition: 'var(--transition-fast)'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: user?.avatarBg || 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFF', fontWeight: '700', fontSize: '13px',
              border: '2px solid rgba(255, 255, 255, 0.15)', flexShrink: 0
            }}>
              {initials}
            </div>
            <div className="hide-mobile" style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                {user?.name || 'Candidate'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.role || 'Candidate'}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'var(--transition-fast)' }} />
          </div>

          {/* ===== PROFILE DROPDOWN PANEL ===== */}
          {isProfileOpen && (
            <div className="glass-panel" style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '340px',
              padding: '0', borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden', zIndex: 100
            }}>
              {/* Profile Header Banner */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
                borderBottom: '1px solid var(--border-glass)',
                display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: user?.avatarBg || 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFF', fontWeight: '800', fontSize: '20px',
                  border: '3px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)', flexShrink: 0
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFF', marginBottom: '2px' }}>
                    {user?.name || 'Candidate'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={12} /> {user?.email || 'user@prepwise.ai'}
                  </div>
                  {user?.role && (
                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', fontSize: '10px', fontWeight: '700' }}>
                        {user.role}
                      </span>
                      {user?.authMethod && (
                        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-teal)', fontSize: '10px', fontWeight: '600' }}>
                          via {user.authMethod}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--border-glass)' }}>
                {[
                  { label: 'Interviews', value: profileStats.interviews.toString(), icon: Award, color: '#6366F1' },
                  { label: 'Avg Score', value: `${profileStats.avgScore}%`, icon: TrendingUp, color: '#14B8A6' },
                  { label: 'Practice', value: `${profileStats.practiceHrs}h`, icon: Clock, color: '#F59E0B' }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} style={{
                      padding: '14px', textAlign: 'center',
                      borderRight: i < 2 ? '1px solid var(--border-glass)' : 'none'
                    }}>
                      <Icon size={16} color={stat.color} style={{ marginBottom: '4px' }} />
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{stat.value}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '600' }}>{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Menu Actions */}
              <div style={{ padding: '8px' }}>
                {[
                  { label: 'Account Settings', icon: Settings },
                  { label: 'Notification Preferences', icon: Bell },
                  { label: 'Dark Mode', icon: Moon, trailing: isDarkMode ? 'On' : 'Off', onClick: toggleTheme },
                  { label: 'Help & Support', icon: HelpCircle }
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={item.onClick}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                        background: 'transparent', border: 'none', color: 'var(--text-main)',
                        fontSize: '13px', fontWeight: '500', cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} color="var(--text-muted)" />
                        <span>{item.label}</span>
                      </div>
                      {item.trailing && (
                        <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '600' }}>{item.trailing}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div style={{ padding: '8px', borderTop: '1px solid var(--border-glass)' }}>
                <button
                  onClick={() => { setIsProfileOpen(false); onLogout(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)', border: 'none',
                    color: '#EF4444', fontSize: '13px', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
