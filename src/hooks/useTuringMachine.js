import { useState, useCallback } from 'react';
import { CONFIG, SIMULATION_STATUS, MACHINE_STATES } from '../utils/constants';
import { performStep } from '../utils/simulation';

export const useTuringMachine = () => {
    const [tape, setTape] = useState({});
    const [head, setHead] = useState(0);
    const [currentState, setCurrentState] = useState(MACHINE_STATES.START);
    const [status, setStatus] = useState(SIMULATION_STATUS.IDLE);
    const [stepCount, setStepCount] = useState(0);
    const [runtimeError, setRuntimeError] = useState(null);
    const [history, setHistory] = useState([]);

    const loadTape = useCallback((inputVal) => {
        const initialTape = {};
        for (let i = 0; i < inputVal.length; i++) initialTape[i] = inputVal[i];
        setTape(initialTape);
        setHead(0);
        setStepCount(0);
        setCurrentState(MACHINE_STATES.START);
        setHistory([]);
        setStatus(SIMULATION_STATUS.IDLE);
        setRuntimeError(null);
    }, []);

    const stepForward = useCallback((transitions) => {
        if (status === SIMULATION_STATUS.ACCEPTED || status === SIMULATION_STATUS.REJECTED) return;

        const result = performStep(transitions, tape, head, currentState);

        // Check for immediate failure in performStep (e.g. no transition or crash)
        if (result.status === SIMULATION_STATUS.REJECTED) {
            setStatus(SIMULATION_STATUS.REJECTED);
            setRuntimeError(result.error || "Erro desconhecido");

            // Save state even on error to allow debugging
            setHistory(prev => [...prev.slice(-CONFIG.MAX_HISTORY), {
                tape: { ...tape },
                head,
                currentState,
                status,
                stepCount
            }]);
            return;
        }

        // Check for immediate acceptance (e.g. transitioned to 'ha' without moving)
        // Note: performStep returns the NEW state. If rule.to was 'ha', result.status is ACCEPTED.

        // Save current state to history BEFORE updating to new state
        setHistory(prev => [...prev.slice(-CONFIG.MAX_HISTORY), {
            tape: { ...tape },
            head,
            currentState,
            status,
            stepCount
        }]);

        // Update State
        setTape(result.tape);
        setHead(result.head);
        setCurrentState(result.currentState);

        // If the step logic determined we are done/accepted
        if (result.status === SIMULATION_STATUS.ACCEPTED) {
            setStatus(SIMULATION_STATUS.ACCEPTED);
        }

        setStepCount(c => c + 1);

    }, [tape, head, currentState, status, stepCount]);

    const stepBack = useCallback(() => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setTape(prev.tape);
        setHead(prev.head);
        setCurrentState(prev.currentState);
        setStepCount(prev.stepCount);
        setStatus(SIMULATION_STATUS.PAUSED);
        setRuntimeError(null);
        setHistory(prev => prev.slice(0, -1));
    }, [history]);

    const jumpToStep = useCallback((targetStep) => {
        // Not implemented yet, but good for future
    }, []);

    return {
        tape,
        head,
        currentState,
        status,
        stepCount,
        runtimeError,
        history,
        loadTape,
        stepForward,
        stepBack,
        setStatus,
        setHead,
        setCurrentState,
        setStepCount,
        setRuntimeError,
        setHistory,
        setTape
    };
};
