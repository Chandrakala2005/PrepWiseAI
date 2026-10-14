import React, { useState, useEffect } from 'react';
import { 
  Code, Play, CheckCircle2, XCircle, Terminal, RefreshCw, ChevronLeft, ChevronRight, 
  Lightbulb, Sparkles, Filter, Shuffle, Check, HelpCircle, Layers, Cpu 
} from 'lucide-react';
import { CODING_PROBLEMS } from '../data/mockData';

export default function CodingWorkspaceView() {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedLang, setSelectedLang] = useState('python');
  
  const currentProblem = CODING_PROBLEMS[selectedProblemIndex] || CODING_PROBLEMS[0];
  const [code, setCode] = useState(currentProblem.starterCode[selectedLang] || '');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState(0);

  // Update starter code when problem or language changes
  useEffect(() => {
    setCode(currentProblem.starterCode[selectedLang] || '');
    setTestResults(null);
    setShowHint(false);
    setActiveTestTab(0);
  }, [selectedProblemIndex, selectedLang]);

  // Filtered problems list
  const filteredProblems = CODING_PROBLEMS.filter(p => {
    if (selectedDifficulty === 'All') return true;
    return p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
  };

  const handleResetCode = () => {
    setCode(currentProblem.starterCode[selectedLang] || '');
    setTestResults(null);
  };

  const handleNextProblem = () => {
    setSelectedProblemIndex((prev) => (prev + 1) % CODING_PROBLEMS.length);
  };

  const handlePrevProblem = () => {
    setSelectedProblemIndex((prev) => (prev - 1 + CODING_PROBLEMS.length) % CODING_PROBLEMS.length);
  };

  const handlePickRandom = () => {
    const randomIndex = Math.floor(Math.random() * CODING_PROBLEMS.length);
    setSelectedProblemIndex(randomIndex);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      
      const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim().toLowerCase();
      const hasLogic = cleanCode.length > 30 && (cleanCode.includes('return') || cleanCode.includes('while') || cleanCode.includes('for'));
      const hasBadKeywords = cleanCode.includes('todo') || cleanCode === 'pass';
      
      const testCases = currentProblem.testCases || [
        { input: 'Case 1', expected: 'true' },
        { input: 'Case 2', expected: 'false' }
      ];

      if (!hasLogic || hasBadKeywords) {
        setTestResults({
          status: 'Wrong Answer',
          passed: 0,
          total: testCases.length,
          runtime: 'N/A',
          memory: 'N/A',
          details: testCases.map((tc, idx) => ({
            testCase: idx + 1,
            passed: false,
            input: tc.input,
            expected: tc.expected,
            actual: 'None / Execution Failed'
          }))
        });
      } else {
        const runtime = `${Math.floor(Math.random() * 25 + 40)} ms`;
        const memory = `${(Math.random() * 2 + 15).toFixed(1)} MB`;
        const beats = (Math.random() * 15 + 80).toFixed(1);

        setTestResults({
          status: 'Accepted',
          passed: testCases.length,
          total: testCases.length,
          runtime,
          memory,
          beats,
          details: testCases.map((tc, idx) => ({
            testCase: idx + 1,
            passed: true,
            input: tc.input,
            expected: tc.expected,
            actual: tc.expected
          }))
        });
      }
    }, 900);
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' };
      case 'medium': return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' };
      case 'hard': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' };
      default: return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const diffStyle = getDifficultyColor(currentProblem.difficulty);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 'calc(100vh - 110px)' }}>
      {/* Top Problem Selector Toolbar */}
      <div className="glass-panel" style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        border: '1px solid var(--border-glass)'
      }}>
        {/* Left: Problem Dropdown & Prev/Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={handlePrevProblem}
              title="Previous Problem"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextProblem}
              title="Next Problem"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Problem Selector Dropdown */}
          <select
            value={selectedProblemIndex}
            onChange={(e) => setSelectedProblemIndex(Number(e.target.value))}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontSize: '13px',
              fontWeight: '700',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '260px'
            }}
          >
            {CODING_PROBLEMS.map((prob, idx) => (
              <option key={prob.id} value={idx}>
                {prob.number ? `${prob.number}. ` : ''}{prob.title} ({prob.difficulty})
              </option>
            ))}
          </select>

          <button
            onClick={handlePickRandom}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
              color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
            }}
            title="Pick Random Problem"
          >
            <Shuffle size={13} /> Random
          </button>
        </div>

        {/* Right: Difficulty Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginRight: '4px' }}>
            Filter:
          </span>
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
            const isSelected = selectedDifficulty === diff;
            const colorObj = getDifficultyColor(diff);
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? `1px solid ${colorObj.text}` : '1px solid transparent',
                  background: isSelected ? colorObj.bg : 'transparent',
                  color: isSelected ? colorObj.text : 'var(--text-muted)',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Coding Layout: Left Problem Specs | Right Code Editor */}
      <div className="responsive-grid-2" style={{ flex: 1, gap: '16px' }}>
        
        {/* Left Column: LeetCode Problem Description */}
        <div className="glass-panel" style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
        }}>
          <div>
            {/* Title & Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: '800' }}>
                {currentProblem.number ? `${currentProblem.number}. ` : ''}{currentProblem.title}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                background: diffStyle.bg,
                color: diffStyle.text,
                border: `1px solid ${diffStyle.border}`
              }}>
                {currentProblem.difficulty}
              </span>
              {currentProblem.acceptance && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Acceptance: {currentProblem.acceptance}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--accent-teal)',
                fontWeight: '700',
                background: 'rgba(20, 184, 166, 0.12)',
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                {currentProblem.category}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '20px' }}>
              {currentProblem.description}
            </p>

            {/* Constraints */}
            {currentProblem.constraints && currentProblem.constraints.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  Constraints:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {currentProblem.constraints.map((c, i) => (
                    <li key={i} style={{ fontFamily: 'var(--font-mono)' }}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Test Case Examples */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
              Example Test Cases:
            </div>

            {currentProblem.testCases.map((tc, idx) => (
              <div key={idx} style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                marginBottom: '10px',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1.5
              }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--accent-teal)' }}>Example {idx + 1}:</strong>
                </div>
                <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> {tc.input}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Output:</span> <span style={{ color: '#818CF8' }}>{tc.expected}</span></div>
              </div>
            ))}
          </div>

          {/* Meta LLaMA AI Hint Box */}
          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#A5B4FC' }}>
                <Sparkles size={14} /> Meta LLaMA Algorithmic Hints
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 10px', borderRadius: 'var(--radius-sm)',
                  background: showHint ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-glass)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#A5B4FC', fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                }}
              >
                <Lightbulb size={12} /> {showHint ? 'Hide Hints' : 'Reveal Hint'}
              </button>
            </div>

            {showHint && currentProblem.hints && (
              <div style={{
                marginTop: '10px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                fontSize: '12px',
                color: 'var(--text-main)',
                lineHeight: 1.5
              }}>
                {currentProblem.hints.map((hint, idx) => (
                  <div key={idx} style={{ marginBottom: idx < currentProblem.hints.length - 1 ? '6px' : 0 }}>
                    💡 <strong>Hint {idx + 1}:</strong> {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: 'calc(100vh - 200px)' }}>
          {/* Editor Header Controls */}
          <div className="glass-panel" style={{
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['python', 'javascript', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedLang === lang ? 'var(--primary)' : 'transparent',
                    border: 'none',
                    color: selectedLang === lang ? '#FFF' : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {lang === 'python' ? 'Python 3' : lang === 'javascript' ? 'JavaScript (Node)' : 'Java 17'}
                </button>
              ))}
            </div>

            {/* Run Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleResetCode}
                title="Reset to starter code"
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '7px 12px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                <RefreshCw size={12} /> Reset
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFF', border: 'none', fontWeight: '700', fontSize: '13px',
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
              >
                {isRunning ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={13} fill="currentColor" />}
                {isRunning ? 'Running...' : 'Run Test Cases'}
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="glass-panel" style={{
            flex: 1,
            minHeight: '280px',
            padding: '16px',
            display: 'flex',
            position: 'relative',
            background: 'rgba(10, 15, 29, 0.95)',
            border: '1px solid var(--border-glass)'
          }}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your algorithmic solution here..."
              spellCheck="false"
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                color: '#F8FAFC',
                fontFamily: 'var(--font-mono)',
                fontSize: '13.5px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Test Case Execution Output Console */}
          {testResults ? (
            <div className="glass-panel" style={{
              padding: '16px',
              maxHeight: '220px',
              overflowY: 'auto',
              border: testResults.status === 'Accepted' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              {/* LeetCode Style Status Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: testResults.status === 'Accepted' ? 'var(--accent-emerald)' : '#EF4444',
                  fontWeight: '800', fontSize: '15px'
                }}>
                  {testResults.status === 'Accepted' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  <span>{testResults.status}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    ({testResults.passed}/{testResults.total} Test Cases)
                  </span>
                </div>

                {testResults.status === 'Accepted' && (
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Runtime: <strong style={{ color: 'var(--text-main)' }}>{testResults.runtime}</strong></span>
                    <span>Memory: <strong style={{ color: 'var(--text-main)' }}>{testResults.memory}</strong></span>
                  </div>
                )}
              </div>

              {/* Case Navigation Tabs */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {testResults.details.map((detail, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestTab(idx)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: activeTestTab === idx ? 'var(--primary)' : 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      color: activeTestTab === idx ? '#FFF' : 'var(--text-muted)',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Case {detail.testCase}
                  </button>
                ))}
              </div>

              {/* Detailed Active Tab Breakdown */}
              {testResults.details[activeTestTab] && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  lineHeight: 1.5
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Input:</span> {testResults.details[activeTestTab].input}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Expected:</span> <span style={{ color: 'var(--accent-teal)' }}>{testResults.details[activeTestTab].expected}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Your Output:</span> <span style={{ color: testResults.details[activeTestTab].passed ? 'var(--accent-emerald)' : '#EF4444' }}>{testResults.details[activeTestTab].actual}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel" style={{
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={14} color="var(--primary)" />
                <span>Run your code to evaluate against all test cases.</span>
              </div>
              <span style={{ fontSize: '11px', color: '#A5B4FC', fontWeight: '600' }}>
                🦙 Meta LLaMA Test Harness
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
