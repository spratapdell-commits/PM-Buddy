import React from 'react';
// FIX: Changed import to be relative
import { DailySnapshot } from '../../types';

const CumulativeFlowDiagram: React.FC<{ snapshots: DailySnapshot[] }> = ({ snapshots }) => {
    if (snapshots.length < 2) {
        return <div className="text-center text-sm text-pm-text-secondary p-4">Not enough data to draw the chart.</div>;
    }
    
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 200;
    const PADDING_X = 40;
    const PADDING_Y = 30;

    const allStatuses = Array.from(new Set(snapshots.flatMap(s => Object.keys(s.statusCounts))));
    // A fixed order is better for consistency
    const statusOrder = ['Done', 'In Progress', 'To Do'].filter(s => allStatuses.includes(s));
    const colors: { [key: string]: string } = {
        'Done': 'var(--pm-green)',
        'In Progress': 'var(--pm-blue)',
        'To Do': 'var(--pm-orange)',
    };

    const maxCount = Math.max(...snapshots.map(s => Object.values(s.statusCounts).reduce((a, b) => a + b, 0)));
    
    const toSvgX = (index: number) => PADDING_X + (index / (snapshots.length - 1)) * (SVG_WIDTH - PADDING_X * 2);
    const toSvgY = (count: number) => (SVG_HEIGHT - PADDING_Y) - (count / maxCount) * (SVG_HEIGHT - PADDING_Y * 2);

    const paths = statusOrder.map(status => {
        const upperPoints = snapshots.map((snapshot, i) => {
            const cumulativeHeight = statusOrder
                .slice(0, statusOrder.indexOf(status) + 1)
                .reduce((acc, currentStatus) => acc + (snapshot.statusCounts[currentStatus] || 0), 0);
            return `${toSvgX(i)},${toSvgY(cumulativeHeight)}`;
        }).join(' L ');

        let lowerPath;
        if (statusOrder.indexOf(status) > 0) {
             const lowerStatusIndex = statusOrder.indexOf(status);
             lowerPath = snapshots.map((snapshot, i) => {
                const lowerCumulativeHeight = statusOrder
                    .slice(0, lowerStatusIndex)
                    .reduce((acc, currentStatus) => acc + (snapshot.statusCounts[currentStatus] || 0), 0);
                return `${toSvgX(i)},${toSvgY(lowerCumulativeHeight)}`;
            }).reverse().join(' L ');
        } else {
            lowerPath = `${toSvgX(snapshots.length - 1)},${toSvgY(0)} L ${toSvgX(0)},${toSvgY(0)}`;
        }
        
        // Corrected path construction
        return `M ${upperPoints} L ${lowerPath} Z`;
    });

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
            <line x1={PADDING_X} y1={PADDING_Y} x2={PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <line x1={PADDING_X} y1={SVG_HEIGHT - PADDING_Y} x2={SVG_WIDTH - PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <text x={PADDING_X - 5} y={PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">{maxCount}</text>
            <text x={PADDING_X - 5} y={SVG_HEIGHT - PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">0</text>
            
            {paths.reverse().map((pathData, index) => {
                const reversedStatusOrder = [...statusOrder].reverse();
                return (
                    <path key={reversedStatusOrder[index]} d={pathData} fill={colors[reversedStatusOrder[index]]} stroke={colors[reversedStatusOrder[index]]} />
                )
            })}
            
            {snapshots.map((s, i) => (
                (i === 0 || i === snapshots.length - 1) && (
                    <text key={s.date} x={toSvgX(i)} y={SVG_HEIGHT - PADDING_Y + 12} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="middle">
                        {s.date}
                    </text>
                )
            ))}
        </svg>
    );
};

export default CumulativeFlowDiagram;