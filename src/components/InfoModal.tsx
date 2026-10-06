import React from 'react';
import { X, Info, Terminal } from 'lucide-react';
import { soundFx } from '../audio/synth';
import { useLanguage } from '../i18n/LanguageContext';

interface InfoModalProps {
  title: string;
  text: string;
  onClose: () => void;
  onOpenTerminal: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  title,
  text,
  onClose,
  onOpenTerminal,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-[#020b18]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020e1d] border border-[#00f5ff]/40 rounded-xl max-w-lg w-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#03172a] border-b border-[#00f5ff]/20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#00f5ff]" />
            <h3 className="font-orbitron text-xs md:text-sm font-bold text-[#00f5ff] uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <button
            onClick={() => {
              soundFx.playBeep(400, 0.03);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 font-tech text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-[#010915]">
          {text}
        </div>

        <div className="bg-[#031526] border-t border-[#00f5ff]/20 px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-slate-700 hover:border-slate-500 text-slate-300 font-orbitron text-xs cursor-pointer"
          >
            {t.common.accept}
          </button>

          <button
            onClick={() => {
              soundFx.playCommandExecute();
              onOpenTerminal();
              onClose();
            }}
            className="px-3.5 py-1.5 bg-[#00f5ff] hover:bg-[#39ff14] text-slate-950 font-orbitron font-bold text-xs rounded transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,255,0.4)] cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.common.interveneTerminal}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
