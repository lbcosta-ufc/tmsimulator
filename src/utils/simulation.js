import { CONFIG, SUBSCRIPT_MAP } from './constants';

export const formatStateLabel = (name) => {
    if (name === 'ha') return 'hₐ';
    const match = name.match(/^([a-zA-Z])(\w+)$/);
    if (match) {
        const base = match[1];
        const sub = match[2].split('').map(c => SUBSCRIPT_MAP[c] || c).join('');
        return `${base}${sub}`;
    }
    return name;
};

export const parseMachineCode = (sourceCode) => {
    const lines = sourceCode.split('\n');
    const newTransitions = {};
    const nodes = new Set();
    const rawEdges = [];
    const errors = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || /^(?:\/\/|#|;)/.test(trimmed)) return;

        const match = trimmed.match(CONFIG.SYNTAX_REGEX);

        if (match) {
            const [, from, read, write, move, to] = match;
            nodes.add(from);
            nodes.add(to);

            const rVis = read === '_' ? 'Δ' : read;
            const wVis = write === '_' ? 'Δ' : write;
            const label = `${rVis}/${wVis}, ${move}`;
            const key = `${from}:${read}`;

            if (newTransitions[key]) {
                errors.push(`Linha ${index + 1}: Conflito de regras para estado '${from}' lendo '${read}'.`);
            }

            newTransitions[key] = { from, write, move, to, label };
            rawEdges.push({ from, to, label });
        } else {
            errors.push(`Linha ${index + 1}: Sintaxe inválida. Esperado: "q0  _/_,R  q1"`);
        }
    });

    if (errors.length > 0) throw new Error(errors[0]);

    // Agrupa arestas visuais
    const edgeMap = new Map();
    rawEdges.forEach(edge => {
        const key = `${edge.from}|${edge.to}`;
        if (!edgeMap.has(key)) {
            edgeMap.set(key, { from: edge.from, to: edge.to, labels: [] });
        }
        edgeMap.get(key).labels.push(edge.label);
    });

    const edges = Array.from(edgeMap.values());
    const edgeIndexMap = new Map();
    edges.forEach((edge, idx) => edgeIndexMap.set(`${edge.from}|${edge.to}`, idx));

    // Associa índice visual à regra lógica
    Object.values(newTransitions).forEach(t => {
        const edgeKey = `${t.from}|${t.to}`;
        if (edgeIndexMap.has(edgeKey)) {
            t.edgeIndex = edgeIndexMap.get(edgeKey);
        }
    });

    return { newTransitions, nodes: Array.from(nodes), edges };
};

export const runFastSimulation = (transitions, inputString) => {
    const tape = {};
    for (let i = 0; i < inputString.length; i++) tape[i] = inputString[i];

    let head = 0;
    let currentState = 'q0';
    let steps = 0;

    while (steps < CONFIG.MAX_BATCH_STEPS) {
        if (currentState === 'ha') return 'ACCEPTED';

        const currentSymbol = tape[head] || '_';
        const key = `${currentState}:${currentSymbol}`;
        const rule = transitions[key];

        if (!rule) return 'REJECTED';

        if (rule.write === '_') delete tape[head];
        else tape[head] = rule.write;

        if (rule.move === 'R') head++;
        else if (rule.move === 'L') head--;

        if (head < 0) return 'REJECTED'; // Crash (Limite esquerdo)

        currentState = rule.to;
        steps++;
    }
    return 'TIMEOUT';
};
