import React from 'react';
// FIX: Changed import to be relative
import { Project } from '../../types';

const VelocityChart: React.FC<{ project: Project }> = ({ project }) => {
    // Mock data for velocity
    const data = [
        { sprint: 'Sprint 1', committed: 20, completed: 18 },
        { sprint: 'Sprint 2', committed: 25, completed: 22 },
        { sprint: 'Sprint 3', committed: 22, completed: 24 },
        { sprint: 'Sprint 4', committed: 23, completed: 20 },
    ];
    
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 200;
    const PADDING_X = 40;
    const PADDING_Y = 30;
    const BAR_WIDTH = (SVG_WIDTH - PADDING_X * 2) / data.length * 0.6;
    const BAR_GAP = (SVG_WIDTH - PADDING_X * 2) / data.length * 0.4;

    const maxPoints = Math.max(...data.flatMap(d => [d.committed, d.completed]), 20);
    const toSvgY = (points: number) => (SVG_HEIGHT - PADDING_Y) - (points / maxPoints) * (SVG_HEIGHT - PADDING_Y * 2);

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
            <line x1={PADDING_X} y1={PADDING_Y} x2={PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <line x1={PADDING_X} y1={SVG_HEIGHT - PADDING_Y} x2={SVG_WIDTH - PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <text x={PADDING_X - 5} y={PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">{maxPoints}</text>
            <text x={PADDING_X - 5} y={SVG_HEIGHT - PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">0</text>
            
            {data.map((d, i) => {
                const x = PADDING_X + i * (BAR_WIDTH + BAR_GAP);
                return (
                    <g key={d.sprint}>
                        <rect 
                            x={x} 
                            y={toSvgY(d.committed)}
                            width={BAR_WIDTH / 2}
                            height={(SVG_HEIGHT - PADDING_Y) - toSvgY(d.committed)}
                            fill="var(--pm-purple)"
                        />
                         <rect 
                            x={x + BAR_WIDTH / 2} 
                            y={toSvgY(d.completed)}
                            width={BAR_WIDTH / 2}
                            height={(SVG_HEIGHT - PADDING_Y) - toSvgY(d.completed)}
                            fill="var(--pm-blue)"
                        />
                         <text 
                            x={x + BAR_WIDTH / 2}
                            y={SVG_HEIGHT - PADDING_Y + 12}
                            fill="var(--pm-text-secondary)"
                            fontSize="10"
                            textAnchor="middle"
                         >
                            {d.sprint.split(' ')[1]}
                         </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default VelocityChart;