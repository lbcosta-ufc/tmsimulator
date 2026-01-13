import React, { memo } from 'react';
import Icons from './ui/Icons';

const Header = memo(({ status, runtimeError, currentState, head, stepCount, activeInput }) => (
    <div className="flex flex-col bg-white shadow-sm z-20 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
                    <Icons.Cpu size={20} />
                </div>
                <h1 className="text-lg font-bold text-slate-800 tracking-tight">TM Simulator</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm flex gap-3">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">Entrada Atual:</span>
                    <span className="text-slate-800 font-medium">{activeInput || "Vazio"}</span>
                </div>
                <div className="h-6 w-px bg-slate-300 mx-1"></div>
                <div className="flex items-center gap-3">
                    {status === 'ACCEPTED' && <span className="flex items-center gap-2 text-emerald-700 font-bold px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full text-xs animate-in fade-in"><Icons.CheckCircle2 size={16} /> ACEITA</span>}
                    {status === 'REJECTED' && <span className="flex items-center gap-2 text-rose-700 font-bold px-3 py-1 bg-rose-100 border border-rose-200 rounded-full text-xs animate-in fade-in"><Icons.XCircle size={16} /> REJEITADA</span>}
                    {runtimeError && <span className="flex items-center gap-2 text-rose-600 text-xs font-medium bg-white px-3 py-1 rounded-full border border-rose-200 shadow-sm"><Icons.AlertCircle size={14} /> {runtimeError}</span>}

                    <div className="text-xs text-slate-500 font-mono bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm flex gap-3">
                        <span>Q: <b className="text-indigo-600">{currentState}</b></span>
                        <span>H: <b className="text-indigo-600">{head}</b></span>
                        <span>Steps: <b className="text-indigo-600">{stepCount}</b></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
));

export default Header;
