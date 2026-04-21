'use client';

import React, { useEffect, useState } from 'react';

interface TickerEvent {
  id: number;
  wallet: string;
  action: 'Bought' | 'Sold';
  amount: string;
  token: string;
}

const chars = '0123456789abcdef';
const rand = (n: number) =>
  Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

const shortWallet = () => `0x${rand(2)}..${rand(5)}`;

const randomToken = () => {
  const tokens = ['ASTEROID', 'WAVZ', 'SOLPEPE', 'MOONCAT', 'DEGEN', 'BONK', 'WIF', 'POPCAT'];
  return tokens[Math.floor(Math.random() * tokens.length)];
};

const randomAmount = () => (Math.random() * 10 + 0.1).toFixed(3);

let idCounter = 0;
const generateEvent = (): TickerEvent => ({
  id: idCounter++,
  wallet: shortWallet(),
  action: Math.random() > 0.35 ? 'Bought' : 'Sold',
  amount: randomAmount(),
  token: randomToken(),
});

export const Marqee = () => {
  // Start with empty array — populated only on client to avoid SSR mismatch
  const [events, setEvents] = useState<TickerEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate initial events only on client
    setEvents(Array.from({ length: 20 }, generateEvent));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setEvents((prev) => [...prev.slice(1), generateEvent()]);
    }, 2500);
    return () => clearInterval(interval);
  }, [mounted]);

  // Render nothing on server / before mount to avoid hydration mismatch
  if (!mounted || events.length === 0) {
    return (
      <div style={{ backgroundColor: '#4284FD', height: '40px', width: '100%' }} />
    );
  }

  const list = [...events, ...events];

  return (
    <div
      style={{
        backgroundColor: '#4284FD',
        height: '60px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        zIndex: 10,
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 'max-content',
          gap: '8px',
          padding: '0 8px',
        }}
      >
        {list.map((e, i) => (
          <span
            key={`${e.id}-${i}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              borderRadius: '14px',
              padding: '8px 10px',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              backgroundColor: '#255DC3',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: 500,fontSize:'15px' }}>{e.wallet}</span>
            <span style={{ color: e.action === 'Bought' ? '#4ade80' : '#f87171', fontWeight: 600 }}>
              {e.action}
            </span>
            <span style={{ color: '#ffffff' }}>{e.amount} SOL</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{e.token}</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 50s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Marqee;