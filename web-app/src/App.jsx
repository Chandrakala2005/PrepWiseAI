import React, { useState, useEffect } from 'react';
import { userApi, authApi, interviewApi } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import InterviewSetupView from './components/InterviewSetupView';
import LiveInterviewView from './components/LiveInterviewView';
import CodingWorkspaceView from './components/CodingWorkspaceView';
import AnalyticsView from './components/AnalyticsView';
import FlashcardsView from './components/FlashcardsView';
import ResumeAnalyzerView from './components/ResumeAnalyzerView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [lastSessionResult, setLastSessionResult] = useState(null);

  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    // Attempt to auto-login if token exists
    const token = localStorage.getItem('prepwise_token');
    if (token) {
      userApi.getProfile()
        .then(userData => {
          setUser(userData);
          setIsAuthenticated(true);
        })
        .catch(err => {
          console.error('Auto-login failed', err);
          authApi.logout();
        })
        .finally(() => {
          setIsInitializing(false);
        });
    } else {
      setIsInitializing(false);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setUser(null);
    setSessionConfig(null);
  };

  const handleStartInterview = () => {
    setActiveTab('interview-setup');
  };

  const handleLaunchLiveSession = (config) => {
    setSessionConfig(config);
    setActiveTab('live-interview');
  };

  const handleEndSession = async (result) => {
    try {
      if (result && sessionConfig) {
        const interviewData = {
          title: `${sessionConfig.role.name} Interview`,
          role: sessionConfig.role.name,
          difficulty: sessionConfig.difficulty,
          score: result.score,
          status: result.score >= 80 ? 'Passed' : 'Needs Work',
          topic: sessionConfig.role.name,
          duration_minutes: sessionConfig.duration,
          ai_persona: sessionConfig.persona.name
        };
        const savedInterview = await interviewApi.save(interviewData);
        setLastSessionResult({ ...result, ...savedInterview, ...sessionConfig });
      }
    } catch (err) {
      console.error('Failed to save interview result', err);
    }
    setActiveTab('analytics');
  };

  if (isInitializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <div style={{ color: 'var(--primary)', fontSize: '20px' }}>Loading PrepWiseAI...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <Navbar
        streakCount={7}
        onStartInterview={handleStartInterview}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Layout Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* View Content Area */}
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardView
              onStartInterview={handleStartInterview}
              onNavigate={(tab) => setActiveTab(tab)}
              user={user}
            />
          )}

          {activeTab === 'interview-setup' && (
            <InterviewSetupView onLaunchLiveSession={handleLaunchLiveSession} />
          )}

          {activeTab === 'live-interview' && sessionConfig && (
            <LiveInterviewView
              sessionConfig={sessionConfig}
              onEndSession={handleEndSession}
            />
          )}

          {activeTab === 'coding' && <CodingWorkspaceView />}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              onStartNewInterview={handleStartInterview} 
              sessionResult={lastSessionResult}
            />
          )}

          {activeTab === 'flashcards' && <FlashcardsView />}

          {activeTab === 'resume' && <ResumeAnalyzerView />}
        </main>
      </div>
    </div>
  );
}

