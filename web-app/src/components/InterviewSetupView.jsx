import React, { useState } from 'react';
import { Video, ShieldCheck, Cpu, Clock, Sparkles, UserCheck, Check, Play } from 'lucide-react';
import { ROLES, AI_PERSONAS } from '../data/mockData';

export default function InterviewSetupView({ onLaunchLiveSession }) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [selectedPersona, setSelectedPersona] = useState(AI_PERSONAS[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('30');

  const difficulties = [
    { level: 'Easy', desc: 'Core fundamentals & straightforward questions' },
    { level: 'Medium', desc: 'Standard production engineering scenarios' },
    { level: 'Hard', desc: 'Complex algorithms, scale edge cases & trade-offs' },
    { level: 'FAANG Level', desc: 'Rigorous Staff/Principal level drill' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
          Configure Your <span className="gradient-text">AI Mock Interview</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Customize your target job domain, technical difficulty, session duration, and AI interviewer personality.
        </p>
      </div>

      {/* Step 1: Select Target Role */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="var(--primary)" /> Step 1: Target Role & Domain
        </h3>

        <div className="responsive-grid-3">
          {ROLES.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'var(--bg-glass)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: isSelected ? '#FFF' : 'var(--text-main)' }}>{role.name}</span>
                  {isSelected && <Check size={16} color="var(--primary)" />}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{role.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select AI Interviewer Persona */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} color="var(--accent-teal)" /> Step 2: Choose AI Interviewer Persona
        </h3>

        <div className="responsive-grid-3">
          {AI_PERSONAS.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'var(--bg-glass)',
                  border: isSelected ? `2px solid ${persona.accentColor}` : '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: persona.avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    color: '#FFF'
                  }}>
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{persona.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{persona.title}</div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {persona.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Difficulty & Duration */}
      <div className="dashboard-split">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="var(--accent-pink)" /> Step 3: Technical Difficulty
          </h3>

          <div className="responsive-grid-2">
            {difficulties.map((diff) => (
              <button
                key={diff.level}
                onClick={() => setDifficulty(diff.level)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: difficulty === diff.level ? 'rgba(236, 72, 153, 0.18)' : 'var(--bg-glass)',
                  border: difficulty === diff.level ? '2px solid var(--accent-pink)' : '1px solid var(--border-glass)',
                  color: difficulty === diff.level ? '#FFF' : 'var(--text-muted)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{diff.level}</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{diff.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--accent-amber)" /> Duration
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['15 Mins', '30 Mins', '45 Mins'].map((time) => {
              const val = time.split(' ')[0];
              const isSelected = duration === val;
              return (
                <button
                  key={time}
                  onClick={() => setDuration(val)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-glass)',
                    border: isSelected ? '2px solid var(--accent-amber)' : '1px solid var(--border-glass)',
                    color: isSelected ? '#FFF' : 'var(--text-muted)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {time} Session
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Launch CTA */}
      <button
        onClick={() => onLaunchLiveSession({ role: selectedRole, persona: selectedPersona, difficulty, duration })}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '18px 32px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#FFF',
          border: 'none',
          fontWeight: '800',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.45)',
          transition: 'var(--transition-normal)'
        }}
      >
        <Play size={20} fill="currentColor" />
        Launch Live AI Interview Room
      </button>
    </div>
  );
}
