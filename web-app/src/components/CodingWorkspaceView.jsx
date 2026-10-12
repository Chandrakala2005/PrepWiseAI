import React, { useState } from 'react';
import { Code, Play, CheckCircle2, XCircle, Terminal, RefreshCw } from 'lucide-react';
import { CODING_PROBLEMS } from '../data/mockData';

export default function CodingWorkspaceView() {
  const problem = CODING_PROBLEMS[0];
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setCode(problem.starterCode[lang] || '');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      
      // Basic static analysis to check if they actually wrote code
      const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim().toLowerCase();
      const hasLogic = cleanCode.length > 20 && (cleanCode.includes('return') || cleanCode.includes('print'));
      const hasBadKeywords = cleanCode.includes('todo') || cleanCode === 'pass';
      
      if (!hasLogic || hasBadKeywords) {
        setTestResults({
          passed: 0,
          total: 2,
          runtime: 'N/A',
          memory: 'N/A',
          details: [
            { testCase: 1, status: 'FAILED', input: 'root = [2,1,3]', expected: 'true', actual: 'null / error' },
            { testCase: 2, status: 'FAILED', input: 'root = [5,1,4,null,null,3,6]', expected: 'false', actual: 'null / error' }
          ]
        });
      } else {
        setTestResults({
          passed: 2,
          total: 2,
          runtime: '48 ms',
          memory: '16.4 MB',
          details: [
            { testCase: 1, status: 'PASSED', input: 'root = [2,1,3]', expected: 'true', actual: 'true' },
            { testCase: 2, status: 'PASSED', input: 'root = [5,1,4,null,null,3,6]', expected: 'false', actual: 'false' }
          ]
        });
      }
    }, 1200);
  };

  return (
    <div className="responsive-grid-2" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Left Column: Problem Description */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: '800' }}>{problem.title}</span>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--accent-amber)'
            }}>
              {problem.difficulty}
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: '600', marginBottom: '16px' }}>
            Category: {problem.category}
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {problem.description}
          </p>
        </div>

        {/* Examples */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>
            Test Case Examples:
          </div>

          {problem.testCases.map((tc, idx) => (
            <div key={idx} style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)',
              marginBottom: '10px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}>
              <div><strong>Input:</strong> {tc.input}</div>
              <div><strong>Expected Output:</strong> {tc.expected}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Code Editor & Console Output */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Editor Controls */}
        <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['python', 'javascript', 'java'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                style={{
                  padding: '6px 12px',
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
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFF',
              border: 'none',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {isRunning ? <RefreshCw size={14} className="spin" /> : <Play size={14} fill="currentColor" />}
            {isRunning ? 'Compiling...' : 'Run Test Cases'}
          </button>
        </div>

        {/* Code Input */}
        <div className="glass-panel" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              color: '#F8FAFC',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* Console Output */}
        {testResults && (
          <div className="glass-panel" style={{ padding: '16px', maxHeight: '180px', overflowY: 'auto' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', 
              color: testResults.passed === testResults.total ? 'var(--accent-emerald)' : '#EF4444', 
              fontWeight: '700', fontSize: '14px' 
            }}>
              {testResults.passed === testResults.total ? <CheckCircle2 size={16} /> : <XCircle size={16} />} 
              {testResults.passed === testResults.total ? 'All Test Cases Passed' : 'Test Cases Failed'} ({testResults.passed}/{testResults.total}) — Runtime: {testResults.runtime}
            </div>

            {testResults.details.map((res, i) => (
              <div key={i} style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                Testcase {res.testCase}: Input {res.input} ➔ Output {res.actual}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
