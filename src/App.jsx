import React, { useState, useEffect, useCallback } from 'react';
import mermaid from 'mermaid';
import Header from './components/Header';
import TapeVisualizer from './components/TapeVisualizer';
import EditorPanel from './components/EditorPanel';
import TestPanel from './components/TestPanel';
import DiagramVisualizer from './components/DiagramVisualizer';
import PlaybackControls from './components/PlaybackControls';

import { CONFIG, DEFAULT_CODE, SIMULATION_STATUS } from './utils/constants';
import { parseMachineCode, runFastSimulation } from './utils/simulation';
import { useTuringMachine } from './hooks/useTuringMachine';

function App() {
  // --- Definition State (Editor & Parser) ---
  const [editorCode, setEditorCode] = useState(DEFAULT_CODE);
  const [isDirty, setIsDirty] = useState(false);
  const [transitions, setTransitions] = useState({});
  const [visualData, setVisualData] = useState({ nodes: [], edges: [] });
  const [compileError, setCompileError] = useState(null);

  // --- Runtime State (via Hook) ---
  const tm = useTuringMachine();

  // --- Layout State ---
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isTestsOpen, setIsTestsOpen] = useState(true);

  // --- Control State ---
  const [activeInput, setActiveInput] = useState('abba');
  const [speed, setSpeed] = useState(500);

  // --- Test Suite State ---
  const [tests, setTests] = useState([
    { id: 1, input: 'abba', status: 'IDLE' },
    { id: 2, input: 'bab', status: 'IDLE' },
    { id: 3, input: 'aabaab', status: 'IDLE' },
    { id: 4, input: 'aabb', status: 'IDLE' }
  ]);
  const [isRunningBatch, setIsRunningBatch] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    // Moved mermaid intialization out or to a better place to avoid re-runs
    // But for App mount it's fine. 
    // Optimization: We will handle mermaid config in DiagramVisualizer to be safer, 
    // but the global init here is okay for defaults.
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: 'Fira Code, monospace',
      flowchart: { curve: 'basis', htmlLabels: false },
      themeVariables: {
        mainBkg: '#ffffff',
        nodeBorder: '#334155',
        edgeLabelBackground: '#ffffff',
        tertiaryColor: '#f1f5f9',
        fontFamily: 'Fira Code, monospace'
      }
    });
    compileAndReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditorChange = useCallback((val) => {
    setEditorCode(val);
    setIsDirty(true);
  }, []);

  const compileAndReset = useCallback(() => {
    try {
      const { newTransitions, nodes, edges } = parseMachineCode(editorCode);
      if (nodes.length === 0) throw new Error("Nenhum estado válido encontrado.");

      setTransitions(newTransitions);
      setVisualData({ nodes, edges });
      setCompileError(null);
      setIsDirty(false);

      // Reset Machine
      tm.loadTape(activeInput);

    } catch (err) {
      setCompileError(err.message);
      setVisualData({ nodes: [], edges: [] });
      setIsDirty(false);
    }
  }, [editorCode, activeInput, tm.loadTape]); // tm.loadTape is stable

  // --- Simulation Control ---
  const handleStepForward = useCallback(() => {
    tm.stepForward(transitions);
  }, [tm, transitions]);

  useEffect(() => {
    let interval;
    if (tm.status === SIMULATION_STATUS.RUNNING) {
      const delay = 1000 - speed;
      interval = setInterval(handleStepForward, Math.max(50, delay));
    }
    return () => clearInterval(interval);
  }, [tm.status, speed, handleStepForward]);

  // --- Interaction Handlers ---
  const handleCellClick = useCallback((index) => {
    tm.setStatus(SIMULATION_STATUS.IDLE);
    tm.setHead(index);
    tm.setCurrentState('q0'); // Should be generic START state if we had dynamic start
    tm.setStepCount(0);
    tm.setRuntimeError(null);
    tm.setHistory([]);
  }, [tm]);

  const handleLoadTest = (inputVal) => {
    setActiveInput(inputVal);
    tm.loadTape(inputVal);
  };

  // --- Test Suite Handlers ---
  const handleAddTest = () => {
    setTests(prev => [...prev, { id: Date.now(), input: '', status: 'IDLE' }]);
  };

  const handleRemoveTest = (id) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTestInput = (id, val) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, input: val, status: 'IDLE' } : t));
  };

  const handleRunTests = () => {
    setIsRunningBatch(true);
    setTimeout(() => {
      setTests(prev => prev.map(test => {
        const result = runFastSimulation(transitions, test.input);
        return { ...test, status: result };
      }));
      setIsRunningBatch(false);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <Header
        status={tm.status}
        runtimeError={tm.runtimeError}
        currentState={tm.currentState}
        head={tm.head}
        stepCount={tm.stepCount}
        activeInput={activeInput}
      />
      <TapeVisualizer
        tape={tm.tape}
        head={tm.head}
        status={tm.status}
        onCellClick={handleCellClick}
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorPanel
          editorCode={editorCode}
          setEditorCode={handleEditorChange}
          onCompile={compileAndReset}
          isDirty={isDirty}
          compileError={compileError}
          isOpen={isEditorOpen}
          onToggle={() => setIsEditorOpen(!isEditorOpen)}
        />

        <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50 border-r border-slate-200 transition-all duration-300" style={{ flexGrow: (isEditorOpen && isTestsOpen) ? 2 : 4 }}>
          <DiagramVisualizer
            visualData={visualData}
            currentState={tm.currentState}
            tape={tm.tape}
            head={tm.head}
            transitions={transitions}
            status={tm.status}
            compileError={compileError}
          />
          <PlaybackControls
            onStepBack={tm.stepBack}
            onStepForward={handleStepForward}
            onPlayPause={() => tm.setStatus(s => s === SIMULATION_STATUS.RUNNING ? SIMULATION_STATUS.PAUSED : SIMULATION_STATUS.RUNNING)}
            status={tm.status}
            speed={speed}
            setSpeed={setSpeed}
            historyLength={tm.history.length}
          />
        </div>

        <TestPanel
          tests={tests}
          onAddTest={handleAddTest}
          onRemoveTest={handleRemoveTest}
          onUpdateTestInput={handleUpdateTestInput}
          onRunTests={handleRunTests}
          onLoadTest={handleLoadTest}
          isRunningBatch={isRunningBatch}
          isOpen={isTestsOpen}
          onToggle={() => setIsTestsOpen(!isTestsOpen)}
        />
      </div>
    </div>
  );
}

export default App;
