export const CONFIG = {
    MAX_HISTORY: 2000,
    MAX_BATCH_STEPS: 5000,
    TAPE_CELL_WIDTH: 56,
    TAPE_CELL_MARGIN: 8,
    SYNTAX_REGEX: /^(\w+)\s+([^\s\/]+)\s*\/\s*([^\s,]+)\s*,\s*([RLS])\s+(\w+)$/
};

export const THEME = {
    primary: '#ea580c', // Laranja
    success: '#10b981', // Verde
    error: '#ef4444', // Vermelho
    stroke: '#94a3b8', // Cinza
    text: '#312e81'  // Indigo
};

export const DEFAULT_CODE = `// Inversor de Bits (0 <-> 1)
// Sintaxe: EstadoAtual  Lido/Escrito,Dir  ProxEstado

q0  0/1,R  q0
q0  1/0,R  q0
q0  _/_,S  ha`;

export const SUBSCRIPT_MAP = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'k': 'ₖ',
    'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ',
    'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
};
