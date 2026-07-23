import React from 'react';
import { Award, CheckCircle2, AlertCircle, Download, Share2, TrendingUp, Sparkles, MessageSquare, Zap } from 'lucide-react';

export default function AnalyticsView({ onStartNewInterview, sessionResult }) {
  if (!sessionResult) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px' }}>
          <AlertCircle size={32} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>No Interview Data Yet</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '400px', lineHeight: 1.5, marginBottom: '24px' }}>
          Complete your first AI mock interview to receive a detailed competency breakdown, score, and feedback report.
        </p>
        <button
          onClick={onStartNewInterview}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
            borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: '#FFF', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Sparkles size={16} /> Start Your First Session
        </button>
      </div>
    );
  }

  const score = sessionResult.score;
  const status = score >= 80 ? 'Passed' : 'Needs Work';
  
  const categories = [
    { name: 'Technical Depth', score: Math.min(100, score + 4), status: score + 4 >= 80 ? 'Excellent' : 'Needs Work', color: '#10B981' },
    { name: 'Communication Clarity', score: Math.min(100, Math.max(0, score - 3)), status: score - 3 >= 80 ? 'Good' : 'Needs Work', color: '#6366F1' },
    { name: 'Confidence & Pace', score: Math.min(100, score), status: score >= 80 ? 'Strong' : 'Needs Work', color: '#14B8A6' },
    { name: 'Problem Solving', score: Math.min(100, Math.max(0, score - 1)), status: score - 1 >= 80 ? 'Strong' : 'Needs Work', color: '#F59E0B' }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.18)',
            color: 'var(--accent-emerald)',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '10px'
          }}>
            <Sparkles size={14} /> Evaluation Completed
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>AI Performance Report & Critique</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {sessionResult?.title || 'System Design & HashMap Algorithm Interview Session'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            <Download size={16} /> Download PDF
          </button>
          <button
            onClick={onStartNewInterview}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#FFF',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Start New Session
          </button>
        </div>
      </div>

      {/* Main Score Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Overall Gauge */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '16px' }}>
            OVERALL CANDIDATE SCORE
          </div>

          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `conic-gradient(${score >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)'} 0% ${score}%, rgba(255,255,255,0.08) ${score}% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              background: 'var(--bg-dark)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)' }}>{score}%</span>
                <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ color: score >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontSize: '13px', fontWeight: '700' }}>
            {score >= 80 ? 'Ready for Senior / FAANG Onsite' : 'Keep Practicing!'}
          </div>
        </div>

        {/* Category Meters */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Competency Score Breakdown</h3>

          {categories.map((cat, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600' }}>{cat.name}</span>
                <span style={{ fontWeight: '800', color: cat.color }}>{cat.score}% ({cat.status})</span>
              </div>
              <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-glass)' }}>
                <div style={{ width: `${cat.score}%`, height: '100%', borderRadius: '4px', background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Answer Critique & Highlights */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="var(--primary)" /> AI Answer-by-Answer Evaluation & Key Concepts
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>Question 1: HashMap Implementation & Treeify Threshold</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-emerald)' }}>Score: 95/100</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
              <strong>AI Feedback:</strong> Excellent explanation of bucket indices, hashing functions, load factor threshold (0.75), and Red-Black tree conversion when bucket size reaches 8.
            </p>
            <div style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: '600' }}>
              ✓ Key Strengths: Mentioned Java 8+ treeification threshold and Big-O trade-offs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
