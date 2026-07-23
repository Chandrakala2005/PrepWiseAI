import React, { useState } from 'react';
import { authApi } from '../services/api';
import {
  Sparkles, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck,
  Phone, KeyRound, User, Briefcase, Globe, Code2, Share2
} from 'lucide-react';

export default function LoginView({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError(isSignUp ? 'Please fill in your name, email, and password.' : 'Please fill in both email and password.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      let data;
      if (isSignUp) {
        data = await authApi.register(name, email, password);
      } else {
        data = await authApi.login(email, password);
      }
      
      authApi.saveSession(data.token, data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.2) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.2) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(20, 184, 166, 0.12) 0px, transparent 50%)
      `,
      padding: '32px 20px',
      overflowY: 'auto'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '36px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        position: 'relative'
      }}>
        {/* Brand Title Banner */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={26} color="#FFF" />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            PrepWise<span className="gradient-text">AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Choose your preferred sign-in method to access the AI Interview Suite
          </p>
        </div>



        {/* Global Error Banner */}
        {error && (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '18px'
          }}>
            {error}
          </div>
        )}

        {/* EMAIL & PASSWORD FORM */}
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required={isSignUp}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                Email Address or User ID
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@prepwise.ai"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Password</label>
                {!isSignUp && <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Forgot?</span>}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '13px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#FFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(99, 102, 241, 0.35)'
              }}
            >
              {isLoading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}
              <ArrowRight size={16} />
            </button>
          </form>



        {/* Footer Toggle */}
        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already registered?' : "Don't have a candidate account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', marginLeft: '4px' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up Free'}
          </button>
        </div>
      </div>
    </div>
  );
}
