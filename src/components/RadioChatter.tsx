import React from 'react';
import { Radio, X } from 'lucide-react';
import { soundFx } from '../audio/synth';

interface RadioChatterProps {
  message: {
    sender: string;
    text: string;
    callsign: string;
  } | null;
  onDismiss: () => void;
}

export const RadioChatter: React.FC<RadioChatterProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-16 right-4 md:right-8 max-w-sm w-full bg-[#030f1f]/95 border border-[#00f5ff]/40 rounded-lg p-3.5 shadow-2xl backdrop-blur-md z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between border-b border-[#00f5ff]/20 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5ff] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f5ff]" />
          </span>
          <Radio className="w-3.5 h-3.5 text-[#00f5ff]" />
          <span className="font-orbitron text-xs font-bold text-[#00f5ff] tracking-wider uppercase">
            {message.sender}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-tech text-amber-400">[{message.callsign}]</span>
          <button
            onClick={() => {
              soundFx.playBeep(400, 0.03);
              onDismiss();
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="font-tech text-xs text-slate-200 leading-relaxed">
        "{message.text}"
      </p>
    </div>
  );
};
