
import React from 'react';
import { Issue, IssuePriority } from '../../types';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { StoryIcon, TaskIcon, BugIcon, PriorityHighestIcon, PriorityHighIcon, PriorityMediumIcon, PriorityLowIcon, PriorityLowestIcon } from '../Icons';

interface BacklogIssueRowProps {
    issue: Issue;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
}

const IssueTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'Story': return <StoryIcon className="w-4 h-4 text-pm-green" />;
    case 'Task': return <TaskIcon className="w-4 h-4 text-pm-blue" />;
    case 'Bug': return <BugIcon className="w-4 h-4 text-pm-red" />;
    default: return null;
  }
};

const PriorityIcon: React.FC<{ priority: IssuePriority }> = ({ priority }) => {
    switch (priority) {
        case IssuePriority.HIGHEST: return <PriorityHighestIcon className="w-4 h-4" />;
        case IssuePriority.HIGH: return <PriorityHighIcon className="w-4 h-4" />;
        case IssuePriority.MEDIUM: return <PriorityMediumIcon className="w-4 h-4" />;
        case IssuePriority.LOW: return <PriorityLowIcon className="w-4 h-4" />;
        case IssuePriority.LOWEST: return <PriorityLowestIcon className="w-4 h-4" />;
        default: return null;
    }
};

const BacklogIssueRow: React.FC<BacklogIssueRowProps> = ({ issue, isSelected, onToggleSelect }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: issue.id,
        data: { issue },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            className={`flex items-center p-2 rounded-md border ${isSelected ? 'bg-pm-blue/10 border-pm-blue' : 'bg-pm-dark border-pm-border'} hover:bg-pm-border/50 cursor-grab`}
        >
            <div className="flex-shrink-0 mr-2">
                <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onToggleSelect(issue.id)}
                    onClick={(e) => e.stopPropagation()} // Prevent drag from starting on checkbox click
                    className="w-4 h-4 rounded text-pm-blue bg-pm-dark border-pm-border focus:ring-pm-blue"
                />
            </div>
            <div className="flex-shrink-0 mr-2">
                <IssueTypeIcon type={issue.type} />
            </div>
            <div className="flex-1 truncate mr-4">
                <p className="text-sm truncate" title={issue.summary}>{issue.summary}</p>
            </div>
            <div className="flex items-center space-x-4 text-pm-text-secondary text-sm">
                <span className="w-16">{issue.status}</span>
                <PriorityIcon priority={issue.priority} />
                 {issue.storyPoints && (
                    <div className="text-xs bg-pm-border rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                      {issue.storyPoints}
                    </div>
                  )}
                <div className="flex -space-x-2">
                    {issue.assignees.map(user => (
                      <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full border-2 border-pm-dark" title={user.name} />
                    ))}
                </div>
                 <span className="w-16 text-right">{issue.key}</span>
            </div>
        </div>
    );
};

export default BacklogIssueRow;
