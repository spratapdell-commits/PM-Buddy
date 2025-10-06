import React from 'react';
// FIX: Changed import to be relative
import { Sprint, Issue } from '../../types';

const BurndownChart: React.FC<{ sprint: Sprint, issues: Issue[] }> = ({ sprint, issues }) => {
    if (!sprint.startDate || !sprint.endDate) {
        return <div className="text-center text-sm text-pm-text-secondary p-4">Sprint dates are not set.</div>;
    }

    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 200;
    const PADDING_X = 40;
    const PADDING_Y = 30;

    const totalPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);
    
    // Mock data for burndown
    const data = [
        { day: 0, points: totalPoints },
        { day: 1, points: totalPoints - 3 },
        { day: 2, points: totalPoints - 5 },
        { day: 3, points: totalPoints - 5 },
        { day: 4, points: totalPoints - 9 },
        { day: 6, points: totalPoints - 14 },
    ];
    
    const sprintDuration = 10; // Mock duration

    const toSvgX = (day: number) => PADDING_X + (day / sprintDuration) * (SVG_WIDTH - PADDING_X * 2);
    const toSvgY = (points: number) => (SVG_HEIGHT - PADDING_Y) - (points / totalPoints) * (SVG_HEIGHT - PADDING_Y * 2);

    const idealLine = `M${toSvgX(0)},${toSvgY(totalPoints)} L${toSvgX(sprintDuration)},${toSvgY(0)}`;
    const actualLine = data.map(d => `${toSvgX(d.day)},${toSvgY(d.points)}`).join(' L');
    
    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
            <line x1={PADDING_X} y1={PADDING_Y} x2={PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <line x1={PADDING_X} y1={SVG_HEIGHT-PADDING_Y} x2={SVG_WIDTH - PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <text x={PADDING_X - 5} y={PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">{totalPoints}</text>
            <text x={PADDING_X - 5} y={SVG_HEIGHT - PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">0</text>
            
            <path d={idealLine} stroke="var(--pm-border)" strokeDasharray="4" />
            <path d={`M ${actualLine}`} stroke="var(--pm-red)" fill="none" strokeWidth="2" />
            
            {data.map(d => (
                <circle key={d.day} cx={toSvgX(d.day)} cy={toSvgY(d.points)} r="3" fill="var(--pm-red)" />
            ))}
        </svg>
    );
};

export default BurndownChart;