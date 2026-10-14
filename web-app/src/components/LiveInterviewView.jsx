import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, ArrowRight, Lightbulb, Clock, CheckCircle, ShieldAlert, Sparkles, PhoneOff, Loader2 } from 'lucide-react';
import { INTERVIEW_QUESTIONS } from '../data/mockData';
import { aiApi } from '../services/api';

export default function LiveInterviewView({ sessionConfig, onEndSession }) {
  const { role, persona, difficulty, duration } = sessionConfig;
  const questions = INTERVIEW_QUESTIONS[role.id] || INTERVIEW_QUESTIONS['swe'];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const currentQuestion = questions[currentQIndex] || questions[0];

  const [isMicActive, setIsMicActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [allAnswers, setAllAnswers] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(parseInt(duration) * 60);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const recognitionRef = useRef(null);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Speech Synthesis (AI Interviewer Voice Narration)
  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = persona.voicePitch || 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger speech when question changes
  useEffect(() => {
    speakQuestion(`Question ${currentQIndex + 1}. ${currentQuestion.question}`);
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentQIndex]);

  // Speech Recognition Setup (Candidate Mic Input)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition API is not supported in this browser. You can type your answer in the text box below.');
      return;
    }

    if (isMicActive) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsMicActive(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsMicActive(true);

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentTranscript);
        setTextAnswer(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsMicActive(false);
      };

      recognition.onend = () => setIsMicActive(false);

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const handleNextQuestion = async () => {
    const newAnswers = [...allAnswers, textAnswer];
    setAllAnswers(newAnswers);

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setTextAnswer('');
      setSpeechTranscript('');
      setShowHint(false);
    } else {
      setIsEvaluating(true);
      try {
        const fullCandidateAnswers = newAnswers.join('\n\n');
        const evalRes = await aiApi.evaluateAnswer(
          currentQuestion.question,
          fullCandidateAnswers,
          persona,
          role
        );

        if (evalRes && evalRes.data) {
          setIsEvaluating(false);
          onEndSession({
            score: evalRes.data.score || 75,
            feedback: evalRes.data.feedback,
            strengths: evalRes.data.strengths,
            improvements: evalRes.data.improvements,
            answers: newAnswers,
            evaluator: evalRes.data.evaluator
          });
          return;
        }
      } catch (err) {
        console.warn('AI evaluation error, using fallback:', err);
      }

      // Fallback calculation
      let calculatedScore = 70;
      if (newAnswers.join('').trim().length < 10) {
        calculatedScore = 0;
      }
      setIsEvaluating(false);
      onEndSession({
        score: calculatedScore,
        answers: newAnswers
      });
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', height: 'calc(100vh - 120px)' }}>
      {/* Left Column: AI Interviewer Video Feed & Live Question */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* AI Interviewer Stage */}
        <div className="glass-panel" style={{
          padding: '24px',
          background: 'linear-gradient(180deg, rgba(18, 26, 44, 0.9) 0%, rgba(10, 15, 29, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          position: 'relative',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          {/* Avatar Container with Speech Animation */}
          <div style={{
            position: 'relative',
            width: '100px',
            height: '100px'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: persona.avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: '800',
              color: '#FFF',
              boxShadow: isAiSpeaking ? `0 0 35px ${persona.accentColor}` : '0 8px 24px rgba(0,0,0,0.4)',
              transition: 'var(--transition-normal)'
            }}>
              {persona.name.charAt(0)}
            </div>

            {/* AI Speaking Visualizer Badge */}
            {isAiSpeaking && (
              <div style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent-teal)',
                color: '#0A0F1D',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '10px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Volume2 size={12} /> Speaking
              </div>
            )}
          </div>

          {/* Persona Meta & Voice Re-play */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{persona.name}</div>
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={14} color="var(--primary)" /> Read Aloud
              </button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{persona.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: '600' }}>
              Topic: {role.name} • Level: {difficulty}
            </div>
          </div>
        </div>

        {/* Live Question Card */}
        <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px' }}>
                QUESTION {currentQIndex + 1} OF {questions.length}
              </span>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: 'var(--accent-amber)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Request Hint'}
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1.5, marginBottom: '16px' }}>
              {currentQuestion.question}
            </h3>

            {showHint && (
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#FDE68A',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                <strong>Interviewer Hint:</strong> {currentQuestion.hint}
              </div>
            )}
          </div>

          {/* Candidate Answer Text Area */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Your Response (Speak via Microphone or Type below):
            </div>
            <textarea
              rows={4}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Your live speech transcript or typed technical answer will appear here..."
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                resize: 'none',
                marginBottom: '16px'
              }}
            />

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Mic Toggle Button */}
              <button
                onClick={toggleSpeechRecognition}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  background: isMicActive ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-glass)',
                  border: isMicActive ? '2px solid #EF4444' : '1px solid var(--border-glass)',
                  color: isMicActive ? '#EF4444' : 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {isMicActive ? <MicOff size={16} /> : <Mic size={16} color="var(--primary)" />}
                {isMicActive ? 'Stop Recording' : 'Start Voice Input'}
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={isEvaluating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  background: isEvaluating ? 'rgba(99, 102, 241, 0.5)' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: isEvaluating ? 'not-allowed' : 'pointer'
                }}
              >
                {isEvaluating ? (
                  <>Evaluating with LLaMA... <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /></>
                ) : (
                  <>Submit & Next Question <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Session Timer & Live Audio Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Timer Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px' }}>
            SESSION REMAINING TIME
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)',
            color: secondsRemaining < 300 ? '#EF4444' : 'var(--accent-teal)'
          }}>
            {formatTimer(secondsRemaining)}
          </div>
        </div>

        {/* Audio Wave Visualizer */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {isMicActive ? 'Listening to Candidate Voice...' : 'Mic Ready'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}>
            {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.7, 1.1, 0.4].map((delay, idx) => (
              <div
                key={idx}
                className="wave-bar"
                style={{
                  animationDelay: `${delay}s`,
                  opacity: isMicActive ? 1 : 0.2
                }}
              />
            ))}
          </div>
        </div>

        {/* End Session Button */}
        <button
          onClick={onEndSession}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          End Interview Session
        </button>
      </div>
    </div>
  );
}
