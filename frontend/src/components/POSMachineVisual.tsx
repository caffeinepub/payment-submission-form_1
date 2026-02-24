import React from 'react';

export default function POSMachineVisual({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* POS Machine Body */}
      <div className="relative">
        {/* Main terminal body */}
        <div className="w-36 bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl shadow-xl border border-slate-300 overflow-hidden">
          {/* Screen area */}
          <div className="mx-3 mt-3 mb-2 bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-2 shadow-inner">
            <div className="text-center">
              <div className="text-emerald-400 text-xs font-mono font-bold mb-1">READY</div>
              <div className="text-emerald-300 text-xs font-mono">$ ____.__</div>
              <div className="mt-1 flex justify-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>

          {/* Keypad */}
          <div className="px-3 pb-3">
            {/* Number grid */}
            <div className="grid grid-cols-3 gap-1 mb-1">
              {['1','2','3','4','5','6','7','8','9','*','0','#'].map((k) => (
                <div
                  key={k}
                  className="h-5 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium"
                >
                  {k}
                </div>
              ))}
            </div>
            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-1 mt-1">
              <div className="h-4 bg-red-400 rounded shadow-sm flex items-center justify-center text-white text-xs font-bold">✕</div>
              <div className="h-4 bg-yellow-400 rounded shadow-sm flex items-center justify-center text-slate-700 text-xs font-bold">C</div>
              <div className="h-4 bg-emerald-500 rounded shadow-sm flex items-center justify-center text-white text-xs font-bold">✓</div>
            </div>
          </div>
        </div>

        {/* Card slot */}
        <div className="mx-auto w-28 h-2 bg-slate-700 rounded-b-lg shadow-md flex items-center justify-center">
          <div className="w-20 h-0.5 bg-slate-500 rounded" />
        </div>

        {/* Receipt slot */}
        <div className="mx-auto w-24 h-1 bg-slate-300 rounded-b shadow-sm mt-0.5" />

        {/* Base/stand */}
        <div className="mx-auto w-20 h-3 bg-gradient-to-b from-slate-300 to-slate-400 rounded-b-xl shadow-md mt-0.5" />
        <div className="mx-auto w-28 h-2 bg-gradient-to-b from-slate-400 to-slate-500 rounded-b-xl shadow-lg" />
      </div>

      {/* Tap/NFC indicator */}
      <div className="mt-3 flex items-center gap-1.5 text-sky-500">
        <div className="flex gap-0.5">
          <div className="w-0.5 h-3 bg-sky-400 rounded-full" />
          <div className="w-0.5 h-4 bg-sky-500 rounded-full" />
          <div className="w-0.5 h-5 bg-sky-600 rounded-full" />
        </div>
        <span className="text-xs font-medium text-sky-600">Tap to Pay</span>
      </div>
    </div>
  );
}
