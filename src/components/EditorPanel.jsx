import React, { memo, useMemo } from 'react';
import Icons from './ui/Icons';

const EditorPanel = memo(({ editorCode, setEditorCode, onCompile, isDirty, compileError, isOpen, onToggle }) => {
    const statusUI = useMemo(() => {
        if (isDirty) return { color: "bg-amber-400", text: "Não compilado", textClass: "text-amber-600" };
        if (compileError) return { color: "bg-rose-500", text: "Erro", textClass: "text-rose-600" };
        return { color: "bg-emerald-500", text: "Compilado", textClass: "text-emerald-600" };
    }, [isDirty, compileError]);

    if (!isOpen) {
        return (
            <div className="relative z-20 w-0 transition-all duration-300">
                <button
                    onClick={onToggle}
                    className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur border border-slate-200 shadow-md text-slate-500 hover:text-indigo-600 rounded-lg transition"
                    title="Abrir Editor"
                >
                    <Icons.PanelLeft size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-[25%] min-w-[300px] bg-white border-r border-slate-200 flex flex-col z-10 transition-all duration-300">
            <div className="flex-1 flex flex-col relative group bg-slate-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2"><Icons.Terminal size={12} /> Editor</span>
                    <div className="flex items-center gap-2">
                        {isDirty && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Não Salvo</span>}
                        <button onClick={onToggle} className="text-slate-400 hover:text-indigo-600 transition" title="Minimizar"><Icons.ChevronLeft size={16} /></button>
                    </div>
                </div>
                <textarea value={editorCode} onChange={(e) => setEditorCode(e.target.value)} className="flex-1 w-full p-6 font-mono text-sm resize-none focus:outline-none bg-slate-50 text-slate-700 leading-relaxed" spellCheck="false" />
                <div className="bg-white px-5 py-3 text-[10px] border-t border-slate-100 font-mono flex items-center gap-2 overflow-hidden">
                    <span className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-300 ${statusUI.color}`}></span>
                    <span className={`truncate transition-colors duration-300 ${statusUI.textClass}`} title={compileError || statusUI.text}>
                        {compileError ? compileError : statusUI.text}
                    </span>
                </div>
            </div>
            <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <button onClick={onCompile} aria-label="Compilar Código" className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide uppercase transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 ${isDirty ? 'bg-indigo-600 hover:bg-indigo-700 text-white needs-compile shadow-indigo-200' : 'bg-slate-800 hover:bg-slate-900 text-slate-200'}`}>
                    <Icons.Code size={18} /> Compilar
                </button>
            </div>
        </div>
    );
});

export default EditorPanel;
