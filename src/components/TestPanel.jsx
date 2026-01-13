import React from 'react';
import Icons from './ui/Icons';
import { runFastSimulation } from '../utils/simulation'; // If needed for local logic, but logic was passed as props in original?
// Original logic passed `onRunTests` which handled simulation.
// Tests array has status.

const TestPanel = ({ tests, onAddTest, onRemoveTest, onUpdateTestInput, onRunTests, onLoadTest, isRunningBatch, isOpen, onToggle }) => {
    if (!isOpen) {
        return (
            <div className="relative z-20 w-0 transition-all duration-300">
                <button
                    onClick={onToggle}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur border border-slate-200 shadow-md text-slate-500 hover:text-indigo-600 rounded-lg transition"
                    title="Abrir Testes"
                >
                    <Icons.PanelRight size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-[25%] min-w-[300px] bg-white border-l border-slate-200 flex flex-col z-10 h-full transition-all duration-300">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    <button onClick={onToggle} className="text-slate-400 hover:text-indigo-600 transition" title="Minimizar"><Icons.ChevronRight size={16} /></button>
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Icons.CheckCircle2 size={16} className="text-slate-400" /> Casos de Teste
                    </h2>
                </div>
                <button onClick={onRunTests} disabled={isRunningBatch} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1 shadow-sm disabled:opacity-50">
                    <Icons.PlayPlay size={14} /> {isRunningBatch ? 'Rodando...' : 'Executar Todos'}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50 custom-scroll">
                {tests.map((test, index) => (
                    <div key={test.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400 w-4">#{index + 1}</span>
                                <input
                                    type="text"
                                    value={test.input}
                                    onChange={(e) => onUpdateTestInput(test.id, e.target.value)}
                                    placeholder="Entrada vazia"
                                    className="flex-1 text-sm font-mono bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-700"
                                />
                            </div>
                            <button onClick={() => onRemoveTest(test.id)} className="text-slate-300 hover:text-rose-500 transition"><Icons.Trash size={14} /></button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {test.status === 'IDLE' && <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Pendente</span>}
                                {test.status === 'ACCEPTED' && <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold"><Icons.CheckCircle2 size={12} /> Aceito</span>}
                                {test.status === 'REJECTED' && <span className="flex items-center gap-1 text-[10px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-bold"><Icons.XCircle size={12} /> Rejeitado</span>}
                                {test.status === 'TIMEOUT' && <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold"><Icons.AlertCircle size={12} /> Timeout</span>}
                            </div>
                            <button
                                onClick={() => onLoadTest(test.input)}
                                className="text-[10px] text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition flex items-center gap-1"
                                title="Carregar no simulador"
                            >
                                <Icons.Eye size={12} /> Debug
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-slate-200 bg-white">
                <button onClick={onAddTest} className="w-full border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center gap-2">
                    <Icons.Plus size={14} /> Adicionar Caso de Teste
                </button>
            </div>
        </div>
    );
};

export default TestPanel;
