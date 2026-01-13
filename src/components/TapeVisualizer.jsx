import React, { memo } from 'react';
import { CONFIG } from '../utils/constants';
import Icons from './ui/Icons';

const TapeVisualizer = memo(({ tape, head, status, onCellClick }) => {
    const TOTAL_CELL_WIDTH = CONFIG.TAPE_CELL_WIDTH + CONFIG.TAPE_CELL_MARGIN;
    const CENTER_OFFSET = TOTAL_CELL_WIDTH / 2;

    return (
        <div className="relative w-full bg-slate-100/50 h-28 border-b border-slate-200 shadow-inner overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-20 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 text-indigo-500 drop-shadow-md mt-1">
                <Icons.TriangleDown width="24" height="12" />
            </div>
            <div
                className="flex items-center h-full absolute top-0 left-1/2 transition-transform duration-300 ease-in-out tape-container"
                style={{ transform: `translateX(calc(-${head * TOTAL_CELL_WIDTH}px - ${CENTER_OFFSET}px))` }}
            >
                {Array.from({ length: Math.max(head + 15, 30) }).map((_, idx) => {
                    const char = tape[idx] || '_';
                    const isHead = idx === head;
                    let stateStyle = "border-slate-300 bg-white text-slate-400";
                    if (isHead) {
                        if (status === 'REJECTED') stateStyle = "border-rose-500 bg-rose-50 text-rose-700 shadow-lg shadow-rose-200/50 scale-110";
                        else if (status === 'ACCEPTED') stateStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-200/50 scale-110";
                        else stateStyle = "border-indigo-500 bg-white text-indigo-700 shadow-xl shadow-indigo-200/50 scale-110";
                    }
                    return (
                        <div
                            key={idx}
                            onClick={() => onCellClick(idx)}
                            className="flex flex-col items-center justify-center shrink-0 mr-2 cursor-pointer hover:scale-105 transition-transform"
                            style={{ width: `${CONFIG.TAPE_CELL_WIDTH}px` }}
                        >
                            <div className={`tape-cell rounded-xl flex items-center justify-center text-2xl font-mono font-medium border-2 ${stateStyle}`}>
                                {char === '_' ? <span className="opacity-20">Δ</span> : char}
                            </div>
                            <div className={`text-[10px] mt-2 font-mono transition-colors ${isHead ? 'text-indigo-600 font-bold' : 'text-slate-300'}`}>{idx}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default TapeVisualizer;
