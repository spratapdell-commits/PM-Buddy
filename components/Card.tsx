
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// FIX: Changed import to be relative
import { Issue, IssuePriority } from '../types';
// FIX: Changed import to be relative
import { StoryIcon, TaskIcon, BugIcon, PriorityHighestIcon, PriorityHighIcon, PriorityMediumIcon, PriorityLowIcon, PriorityLowestIcon } from './Icons';

interface CardProps {
  issue: Issue;
  isOverlay?: boolean;
  onClick?: () => void;
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

const Card: React.FC<CardProps> = ({ issue, isOverlay, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: issue.id,
    data: {
        type: 'Issue',
        issue,
    },
    disabled: !!isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isOverlay ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : 'none',
    cursor: isOverlay ? 'grabbing' : 'grab',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listitem"
      aria-label={`Issue ${issue.key}: ${issue.summary}`}
      title={issue.isBlocked ? `Blocked by: ${issue.blockedBy?.join(', ')}` : ''}
      className={`relative bg-pm-dark p-3 rounded-md border border-pm-border hover:border-pm-blue/50 select-none focus:outline-none focus:ring-2 focus:ring-pm-blue ${isOverlay ? '' : 'cursor-pointer'}`}
    >
      {issue.isBlocked && <div className="absolute left-0 top-0 bottom-0 w-1 bg-pm-red rounded-l-md"></div>}
      <p className="text-sm text-pm-text leading-snug">{issue.summary}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
            <IssueTypeIcon type={issue.type} />
            <PriorityIcon priority={issue.priority} />
            <span className="text-xs text-pm-text-secondary">{issue.key}</span>
        </div>
        <div className="flex items-center space-x-1">
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
        </div>
      </div>
    </div>
  );
};

export default Card;
