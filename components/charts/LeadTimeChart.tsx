import React from 'react';
import { Issue } from '../../types';

interface LeadTimeData {
    bucket: string;
    count: number;
}

const calculateLeadTime = (issues: Issue[]): LeadTimeData[] => {
    const leadTimesDays: number[] = issues
        .filter(i => i.status === 'Done' && i.createdAt && i.completedAt)
        .map(i => {
            const start = new Date(i.createdAt!).getTime();
            const end = new Date(i.completedAt!).getTime();
            return (end - start) / (1000 * 3600 * 24); // difference in days
        });

    if (leadTimesDays.length === 0) return [];

    const buckets = {
        '< 1 day': 0,
        '1-3 days': 0,
        '3-7 days': 0,
        '1-2 weeks': 0,
        '2-4 weeks': 0,
        '> 4 weeks': 0,
    };

    leadTimesDays.forEach(days => {
        if (days < 1) buckets['< 1 day']++;
        else if (days <= 3) buckets['1-3 days']++;
        else if (days <= 7) buckets['3-7 days']++;
        else if (days <= 14) buckets['1-2 weeks']++;
        else if (days <= 28) buckets['2-4 weeks']++;
        else buckets['> 4 weeks']++;
    });

    return Object.entries(buckets).map(([bucket, count]) => ({ bucket, count }));
};

const LeadTimeChart: React.FC<{ issues: Issue[] }> = ({ issues }) => {
    const data = calculateLeadTime(issues);

    if (issues.filter(i => i.status === 'Done' && i.createdAt && i.completedAt).length === 0) {
        return <div className="text-center text-sm text-pm-text-secondary p-4">No completed issues with date info to show.</div>;
    }
    
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 200;
    const PADDING_X = 60;
    const PADDING_Y = 20;
    const BAR_HEIGHT = (SVG_HEIGHT - PADDING_Y * 2) / data.length * 0.7;

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const toSvgX = (count: number) => PADDING_X + (count / maxCount) * (SVG_WIDTH - PADDING_X * 2);

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
            <line x1={PADDING_X} y1={PADDING_Y} x2={SVG_WIDTH - PADDING_X} y2={PADDING_Y} stroke="var(--pm-border)" />
            <text x={SVG_WIDTH - PADDING_X} y={PADDING_Y - 5} fill="var(--pm-text-secondary)" fontSize="10" textAnchor="end">{maxCount} issues</text>
            
            {data.map((d, i) => {
                const y = PADDING_Y + i * ((SVG_HEIGHT - PADDING_Y * 2) / data.length) + (((SVG_HEIGHT - PADDING_Y * 2) / data.length - BAR_HEIGHT) / 2);
                return (
                    <g key={d.bucket}>
                        <text 
                            x={PADDING_X - 5}
                            y={y + BAR_HEIGHT / 2 + 3}
                            fill="var(--pm-text-secondary)"
                            fontSize="10"
                            textAnchor="end"
                        >
                            {d.bucket}
                        </text>
                        <rect 
                            x={PADDING_X} 
                            y={y}
                            width={toSvgX(d.count) - PADDING_X}
                            height={BAR_HEIGHT}
                            fill="var(--pm-blue)"
                        />
                         <text 
                            x={toSvgX(d.count) + 5}
                            y={y + BAR_HEIGHT / 2 + 3}
                            fill="var(--pm-text)"
                            fontSize="10"
                         >
                            {d.count}
                         </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default LeadTimeChart;