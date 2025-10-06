import React from 'react';
import { Project, Issue } from '../../types';
import Card from '../Card'; // Reusing the same card component for consistency

interface MobileBoardProps {
    project: Project;
}

const MobileBoard: React.FC<MobileBoardProps> = ({ project }) => {
    const issuesById = React.useMemo(() => {
        return project.issues.reduce((acc, issue) => {
            acc[issue.id] = issue;
            return acc;
        }, {} as Record<string, Issue>);
    }, [project.issues]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 flex-shrink-0">
                <h1 className="text-xl font-bold">Board</h1>
            </div>
            
            {/* Horizontal scrolling container for columns */}
            <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory">
                {project.columns.map(column => {
                     const issuesForColumn = column.issueIds
                        .map(id => issuesById[id])
                        .filter(Boolean)
                        .sort((a,b) => a.rank.localeCompare(b.rank));
                        
                    return (
                        <div key={column.id} className="w-11/12 flex-shrink-0 snap-center px-2">
                            <div className="bg-pm-dark-secondary h-full rounded-lg border border-pm-border flex flex-col">
                                <div className="p-3 border-b border-pm-border flex-shrink-0">
                                    <h2 className="font-semibold text-pm-text-secondary uppercase text-sm">{column.title}</h2>
                                </div>
                                <div className="p-2 space-y-2 overflow-y-auto">
                                    {issuesForColumn.map(issue => (
                                        <Card key={issue.id} issue={issue} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MobileBoard;