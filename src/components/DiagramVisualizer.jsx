import React, { useRef, useState, useEffect } from 'react';
import mermaid from 'mermaid';
import Icons from './ui/Icons';
import { THEME } from '../utils/constants';
import { generateMermaidDefinition, applySvgPostProcessing } from '../utils/mermaidUtils';

const DiagramVisualizer = ({ visualData, currentState, transitions, status, compileError, tape, head }) => {
    const containerRef = useRef(null);
    const diagramRef = useRef(null);
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handleWheel = (e) => {
        e.preventDefault();
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(0.2, transform.scale * delta), 4);
        const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
        const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
        setTransform({ x: newX, y: newY, scale: newScale });
    };

    const handleMouseDown = (e) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
        setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    };

    useEffect(() => {
        if (visualData.nodes.length > 0 && diagramRef.current) {
            const render = async () => {
                try {
                    let activeEdgeIndex = null;
                    let activeLabel = null;

                    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
                        const currentSymbol = tape[head] || '_';
                        const key = `${currentState}:${currentSymbol}`;
                        const rule = transitions[key];
                        if (rule) {
                            activeLabel = rule.label;
                            activeEdgeIndex = rule.edgeIndex;
                        }
                    }

                    const mermaidDef = generateMermaidDefinition(
                        visualData.nodes,
                        visualData.edges,
                        currentState,
                        status,
                        activeEdgeIndex
                    );

                    diagramRef.current.removeAttribute('data-processed');
                    // Use mermaid.render from module
                    const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), mermaidDef);
                    if (diagramRef.current) {
                        diagramRef.current.innerHTML = svg;
                        applySvgPostProcessing(diagramRef.current, THEME.primary, activeEdgeIndex, activeLabel);
                    }

                } catch (e) {
                    console.error("Mermaid:", e);
                }
            };
            render();
        }
    }, [visualData, currentState, status, tape, head, transitions]);

    return (
        <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
            <div
                className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing bg-fixed touch-none select-none"
                style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                ref={containerRef}
            >
                <div className="absolute origin-top-left transition-transform duration-75 ease-out flex items-center justify-center w-full h-full" style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}>
                    {compileError ? (
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-rose-200 shadow-xl max-w-md text-center">
                            <div className="text-rose-500 mb-2 flex justify-center"><Icons.AlertCircle size={32} /></div>
                            <h3 className="text-rose-700 font-bold mb-1">Erro de Compilação</h3>
                            <p className="text-rose-600/80 text-sm font-mono break-words">{compileError}</p>
                        </div>
                    ) : <div ref={diagramRef} className="origin-center" />}
                    {visualData.nodes.length === 0 && !compileError && <div className="text-slate-300 flex flex-col items-center"><Icons.Cpu size={48} className="mb-3 opacity-20" /><p className="font-medium">Sem diagrama.</p></div>}
                </div>
            </div>
        </div>
    );
};

export default DiagramVisualizer;
