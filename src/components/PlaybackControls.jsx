import React from 'react';
import Icons from './ui/Icons';

const PlaybackControls = ({ onStepBack, onStepForward, onPlayPause, status, speed, setSpeed, historyLength }) => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(99,102,241,0.15)] rounded-2xl p-2 px-6 flex items-center gap-6 ring-1 ring-slate-900/5">
            <div className="flex items-center gap-3 border-r border-slate-200/60 pr-6 py-1">
                <button onClick={onStepBack} disabled={historyLength === 0 || status === 'RUNNING'} aria-label="Passo Anterior" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full disabled:opacity-30 transition-all"><Icons.SkipBack size={20} /></button>
                <button onClick={onPlayPause} disabled={status === 'ACCEPTED' || status === 'REJECTED'} aria-label={status === 'RUNNING' ? "Pausar" : "Executar"} className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg transition-all active:scale-95 border-b-4 ${status === 'RUNNING' ? 'bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200' : 'bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-700'} disabled:opacity-50 disabled:grayscale disabled:border-transparent disabled:shadow-none`}>
                    {status === 'RUNNING' ? <Icons.Pause size={28} fill="currentColor" /> : <Icons.Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={onStepForward} disabled={status === 'RUNNING' || status === 'ACCEPTED' || status === 'REJECTED'} aria-label="Próximo Passo" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full disabled:opacity-30 transition-all"><Icons.SkipForward size={20} /></button>
            </div>
            <div className="flex flex-col w-36 gap-1.5">
                <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest"><span>Lento</span><span>Rápido</span></div>
                <div className="relative h-4 flex items-center">
                    <input type="range" min="0" max="950" step="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Controle de Velocidade" className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                </div>
            </div>
        </div>
    </div>
);

export default PlaybackControls;
