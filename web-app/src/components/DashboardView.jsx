import React, { useState, useEffect } from 'react';
import { Video, Award, Clock, ArrowRight, CheckCircle2, TrendingUp, Sparkles, Code, BrainCircuit } from 'lucide-react';
import { ROLES } from '../data/mockData';
import { interviewApi, analyticsApi } from '../services/api';

export default function DashboardView({ onStartInterview, onNavigate, user }) {
  const displayName = user?.name || 'Candidate';
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    totalTimeHrs: 0,
    masteryIndex: 0
  });

  useEffect(() => {
    let mounted = true;
    
    // Fetch recent history
    interviewApi.list().then(data => {
      if (!mounted) return;
      if (data && data.length > 0) {
        setHistory(data.slice(0, 5));
      }
    }).catch(err => console.error('Failed to load interview history', err));

    // Fetch real analytics summary from backend
    analyticsApi.summary().then(data => {
      if (!mounted) return;
      
      // Calculate a more realistic mastery index (weighted heavily by passing scores > 70)
      const masteryIndex = data.totalInterviews > 0 
        ? Math.round(data.avgScore * 0.8 + (Math.min(data.totalInterviews, 10) * 2))
        : 0;
        
      setStats({ 
        totalInterviews: data.totalInterviews || 0, 
        avgScore: data.avgScore || 0, 
        totalTimeHrs: data.practiceHours || '0', 
        masteryIndex: masteryIndex 
      });
    }).catch(err => console.error('Failed to load analytics', err));
    
    return () => { mounted = false; };
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(20, 184, 166, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '12px',
            fontWeight: '700',
            color: '#A5B4FC',
            marginBottom: '16px'
          }}>
            <Sparkles size={14} /> Ready for your next tech interview round?
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1.2, marginBottom: '6px' }}>
            Welcome back, <span className="gradient-text">{displayName}</span> 👋
          </h1>
          {user?.email && (
            <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Signed in as <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{user.email}</span>
              {user?.role && <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', fontSize: '11px', fontWeight: '700' }}>{user.role}</span>}
              {user?.authMethod && <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(20, 184, 166, 0.12)', color: 'var(--accent-teal)', fontSize: '11px', fontWeight: '600' }}>via {user.authMethod}</span>}
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            Simulate real-time voice & coding interviews with AI hiring personas tailored to FAANG, top tech startups, and enterprise roles.
          </p>

          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={onStartInterview}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#FFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                transition: 'var(--transition-normal)'
              }}
            >
              <Video size={18} />
              Start Live AI Interview Session
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('coding')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 22px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-glass)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <Code size={18} />
              Practice Coding Assessment
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Mock Interviews Done', value: stats.totalInterviews.toString(), sub: stats.totalInterviews > 0 ? 'Great job!' : 'Start your first today!', icon: Video, color: '#6366F1' },
          { label: 'Average Score', value: `${stats.avgScore}%`, sub: stats.totalInterviews > 0 ? 'Overall performance' : 'Not enough data', icon: Award, color: '#14B8A6' },
          { label: 'Total Practice Time', value: `${stats.totalTimeHrs} hrs`, sub: 'Active practice', icon: Clock, color: '#F59E0B' },
          { label: 'Skill Mastery Index', value: `${stats.masteryIndex}/100`, sub: stats.totalInterviews > 0 ? 'Improving' : 'Keep practicing', icon: TrendingUp, color: '#EC4899' }
        ].map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{stat.label}</span>
                <div style={{
                  padding: '8px',
                  borderRadius: '10px',
                  background: `rgba(${stat.color === '#6366F1' ? '99, 102, 241' : stat.color === '#14B8A6' ? '20, 184, 166' : '245, 158, 11'}, 0.15)`
                }}>
                  <StatIcon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: stat.color, fontWeight: '600' }}>{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Recommended Role Track & Recent Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Recommended Tracks */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Target Interview Tracks</h3>
            <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {ROLES.slice(0, 4).map((role) => (
              <div
                key={role.id}
                className="glass-card-interactive"
                onClick={onStartInterview}
                style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>{role.name}</span>
                  <ArrowRight size={16} color="var(--text-muted)" />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Evaluation History */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px' }}>Recent Score History</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {history.length > 0 ? (
              history.map((score) => (
                <div key={score.id} style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '2px' }}>{score.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{score.created_at ? new Date(score.created_at).toLocaleDateString() : 'Recently'} • {score.topic}</div>
                  </div>

                  <div style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: score.score >= 85 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                    background: score.score >= 85 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {score.score}%
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '30px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}>
                <BrainCircuit size={28} style={{ marginBottom: '10px', opacity: 0.5 }} />
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>No interview history yet</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Complete your first mock interview to see scores here.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
