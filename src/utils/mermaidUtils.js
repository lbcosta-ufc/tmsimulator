import { THEME } from './constants';
import { formatStateLabel } from './simulation';

export const generateMermaidDefinition = (nodes, edges, currentState, status, activeEdgeIndex) => {
    let def = 'flowchart LR\n';
    nodes.forEach(node => {
        const label = formatStateLabel(node);
        const shapeStart = node === 'ha' ? '((("' : '(["';
        const shapeEnd = node === 'ha' ? '")))' : '"])';
        def += `    ${node}${shapeStart}${label}${shapeEnd}\n`;
    });
    edges.forEach(edge => {
        const combined = edge.labels.join('\n');
        def += `    ${edge.from} -->|"${combined}"| ${edge.to}\n`;
    });

    if (status === 'ACCEPTED') def += `\n    style ${currentState} fill:${THEME.success},stroke:${THEME.success},color:white,stroke-width:2px`;
    else if (status === 'REJECTED') def += `\n    style ${currentState} fill:${THEME.error},stroke:${THEME.error},color:white,stroke-width:2px`;
    else def += `\n    style ${currentState} fill:${THEME.primary},stroke:#c2410c,color:white,stroke-width:3px`;

    if (activeEdgeIndex !== null) def += `\n    linkStyle ${activeEdgeIndex} stroke:${THEME.primary},stroke-width:3px;`;
    else def += `\n    linkStyle default stroke:${THEME.stroke},stroke-width:1px;`;

    return def;
};

/**
 * Manipulação segura do DOM SVG para colorir elementos específicos.
 * Suporta HTML Labels = false (iPad/Safari fix)
 */
export const applySvgPostProcessing = (container, activeColor, activeEdgeIndex, activeRuleLabel) => {
    const svgElem = container.querySelector('svg');
    if (!svgElem) return;

    // Fix zoom bug em SVG
    svgElem.style.maxWidth = 'none';
    svgElem.style.height = '100%';
    svgElem.style.width = '100%';
    svgElem.removeAttribute('height'); // Remove height attribute set by mermaid
    // Keep width 100% or remove it too if needed, but 100% is usually safer for containers

    // 1. Colorir Arrowheads (Marcadores)
    const links = svgElem.querySelectorAll('path');
    links.forEach(link => {
        const style = link.getAttribute('style') || '';
        // Verifica se é a linha ativa (Mermaid coloca a cor inline)
        if (style.includes(activeColor) || style.includes('rgb(234, 88, 12)')) {
            const markerUrl = link.getAttribute('marker-end');
            if (markerUrl) {
                const markerIdMatch = markerUrl.match(/#([^"')\)]+)/);
                if (markerIdMatch && markerIdMatch[1]) {
                    const markerId = markerIdMatch[1];
                    const originalMarker = svgElem.getElementById(markerId);
                    if (originalMarker) {
                        // Cria um ID único para não afetar outros marcadores
                        const newMarkerId = markerId + '-active-' + Date.now();
                        const newMarker = originalMarker.cloneNode(true);
                        newMarker.setAttribute('id', newMarkerId);
                        newMarker.querySelectorAll('path, circle, polygon').forEach(p => {
                            p.setAttribute('fill', activeColor);
                            p.setAttribute('stroke', activeColor);
                        });
                        originalMarker.parentNode.appendChild(newMarker);
                        link.setAttribute('marker-end', `url(#${newMarkerId})`);
                    }
                }
            }
        }
    });

    // 2. Colorir o texto específico da regra ativa
    if (activeEdgeIndex !== null && activeRuleLabel) {
        const edgeLabels = svgElem.querySelectorAll('.edgeLabel');
        if (edgeLabels[activeEdgeIndex]) {
            const labelGroup = edgeLabels[activeEdgeIndex];
            const tspans = labelGroup.querySelectorAll('tspan');
            tspans.forEach(tspan => {
                if (tspan.textContent.trim() === activeRuleLabel.trim()) {
                    tspan.setAttribute('fill', activeColor);
                    tspan.setAttribute('font-weight', 'bold');
                    tspan.style.fill = activeColor;
                    tspan.style.fontWeight = 'bold';
                }
            });
        }
    }
};
