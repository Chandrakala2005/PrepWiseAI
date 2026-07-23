import React, { useState } from 'react';
import { Layers, RotateCw, Check, X, Search, Filter, Sparkles } from 'lucide-react';
import { FLASHCARDS } from '../data/mockData';

export default function FlashcardsView() {
  const [cards, setCards] = useState(FLASHCARDS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('All');

  const currentCard = cards[currentIdx] || cards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % cards.length);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Topic Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
            Smart Technical <span className="gradient-text">Flashcards</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Flip 3D cards to test your recall on System Design, Algorithms, and FAANG concepts.
          </p>
        </div>

        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
          Card {currentIdx + 1} of {cards.length}
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="perspective-1000"
        style={{ height: '340px', width: '100%', cursor: 'pointer' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`flip-card-inner glass-panel ${isFlipped ? 'flipped' : ''}`} style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.95) 0%, rgba(26, 37, 62, 0.95) 100%)'
        }}>
          {/* Card Front (Question) */}
          <div className="flip-card-front" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#A5B4FC'
              }}>
                {currentCard.topic} • {currentCard.company}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: '600' }}>
                Tap card to reveal answer 🔄
              </span>
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '700', lineHeight: 1.4, textAlign: 'center' }}>
              {currentCard.question}
            </h3>

            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              Click anywhere on card to flip
            </div>
          </div>

          {/* Card Back (Answer) */}
          <div className="flip-card-back" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(18, 26, 44, 0.95) 100%)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-teal)' }}>
              MODEL EXPLANATION / ANSWER
            </div>

            <p style={{ fontSize: '16px', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {currentCard.answer}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid var(--accent-emerald)',
                  color: 'var(--accent-emerald)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                I Knew This ✓
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Need Review ✗
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
