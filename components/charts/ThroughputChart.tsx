import React from 'react';
import { Issue } from '../../types';

interface ThroughputData {
    week: string;
    count: number;
}

// Helper to get the start of a week (Sunday)
const getWeekStart = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

const calculateThroughput = (issues: Issue[]): ThroughputData[] => {
    const completedIssues = issues.filter(i => i.status === 'Done' && i.completedAt);
    if (completedIssues.length === 0) return [];

    const weeklyCounts: Record<string, number> = {};

    completedIssues.forEach(issue => {
        const completedDate = new Date(issue.completedAt!);
        const weekStartDate = getWeekStart(completedDate);
        const weekKey = weekStartDate.toISOString().split('T')[0];

        if (!weeklyCounts[weekKey]) {
            weeklyCounts[weekKey] = 0;
        }
        weeklyCounts[weekKey]++;
    });

    return Object.entries(weeklyCounts)
        .map(([week, count]) => ({ week, count }))
        .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
        .slice(-8); // Show last 8 weeks
};

const ThroughputChart: React.FC<{ issues: Issue[] }> = ({ issues }) => {
    const data = calculateThroughput(issues);
    
    if (data.length === 0) {
        return <div className="text-center text-sm text-pm-text-secondary p-4">No completed issues with completion dates to show.</div>;
    }
    
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 200;
    const PADDING_X = 40;
    const PADDING_Y = 30;
    const BAR_WIDTH = (SVG_WIDTH - PADDING_X * 2) / data.length * 0.6;

    const maxCount = Math.max(...data.map(d => d.count), 5);
    const toSvgY = (count: number) => (SVG_HEIGHT - PADDING_Y) - (count / maxCount) * (SVG_HEIGHT - PADDING_Y * 2);

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
            <line x1={PADDING_X} y1={PADDING_Y} x2={PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <line x1={PADDING_X} y1={SVG_HEIGHT - PADDING_Y} x2={SVG_WIDTH - PADDING_X} y2={SVG_HEIGHT - PADDING_Y} stroke="var(--pm-border)" />
            <text x={PADDING_X - 5} y={PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">{maxCount}</text>
            <text x={PADDING_X - 5} y={SVG_HEIGHT - PADDING_Y} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">0</text>
            
            {data.map((d, i) => {
                const x = PADDING_X + i * ((SVG_WIDTH - PADDING_X * 2) / data.length) + ((SVG_WIDTH - PADDING_X * 2) / data.length - BAR_WIDTH) / 2;
                return (
                    <g key={d.week}>
                        <rect 
                            x={x} 
                            y={toSvgY(d.count)}
                            width={BAR_WIDTH}
                            height={(SVG_HEIGHT - PADDING_Y) - toSvgY(d.count)}
                            fill="var(--pm-purple)"
                        />
                         <text 
                            x={x + BAR_WIDTH / 2}
                            y={SVG_HEIGHT - PADDING_Y + 12}
                            fill="var(--pm-text-secondary)"
                            fontSize="10"
                            textAnchor="middle"
                         >
                            {d.week.substring(5)}
                         </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default ThroughputChart;