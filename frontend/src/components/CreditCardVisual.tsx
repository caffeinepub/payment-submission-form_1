import React from 'react';
import { Wifi } from 'lucide-react';

interface CreditCardVisualProps {
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  className?: string;
}

export default function CreditCardVisual({
  cardNumber = '',
  cardHolder = '',
  expiry = '',
  className = '',
}: CreditCardVisualProps) {
  const formatDisplay = (num: string): string[] => {
    const clean = num.replace(/\s/g, '');
    const groups: string[] = [];
    for (let i = 0; i < 4; i++) {
      const chunk = clean.slice(i * 4, i * 4 + 4);
      groups.push(chunk.padEnd(4, '•'));
    }
    return groups;
  };

  const groups = formatDisplay(cardNumber);

  return (
    <div
      className={`relative w-full max-w-sm aspect-[1.586/1] rounded-2xl card-gradient p-6 text-white shadow-xl overflow-hidden select-none ${className}`}
      style={{ minWidth: 280 }}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 card-shine rounded-2xl pointer-events-none" />

      {/* Background circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full bg-white/5" />

      {/* Top row */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <div className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">PaySecure</div>
          <div className="text-lg font-display font-bold tracking-wide">VISA</div>
        </div>
        <Wifi className="w-6 h-6 text-white/70 rotate-90" />
      </div>

      {/* Chip */}
      <div className="relative mb-5">
        <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-sm">
          <div className="w-6 h-5 rounded-sm border border-yellow-600/40 grid grid-cols-2 gap-px p-0.5">
            <div className="bg-yellow-600/30 rounded-sm" />
            <div className="bg-yellow-600/30 rounded-sm" />
            <div className="bg-yellow-600/30 rounded-sm" />
            <div className="bg-yellow-600/30 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Card number */}
      <div className="relative flex gap-3 mb-5 font-mono text-lg tracking-widest">
        {groups.map((group, i) => (
          <span key={i} className="text-white/90 font-semibold">
            {group}
          </span>
        ))}
      </div>

      {/* Bottom row */}
      <div className="relative flex items-end justify-between">
        <div>
          <div className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Card Holder</div>
          <div className="text-sm font-semibold tracking-wide truncate max-w-[160px]">
            {cardHolder || 'YOUR NAME'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Expires</div>
          <div className="text-sm font-semibold font-mono">
            {expiry || 'MM/YY'}
          </div>
        </div>
      </div>
    </div>
  );
}
