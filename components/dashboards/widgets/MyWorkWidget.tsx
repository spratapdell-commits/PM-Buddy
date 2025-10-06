import React from 'react';
import { User, Issue, IssueType } from '../../../types';
import { TaskIcon, StoryIcon, BugIcon } from '../../Icons';

interface MyWorkWidgetProps {
    currentUser: User;
    issues: Issue[];
    onIssueClick: (issue: Issue) => void;
}

const IssueTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'Story': return <StoryIcon className="w-4 h-4 text-pm-green" />;
    case 'Task': return <TaskIcon className="w-4 h-4 text-pm-blue" />;
    case 'Bug': return <BugIcon className="w-4 h-4 text-pm-red" />;
    default: return null;
  }
};

const IssueRow: React.FC<{ issue: Issue, onClick: () => void }> = ({ issue, onClick }) => {
    return (
        <div className="group flex items-center justify-between p-2 rounded-md hover:bg-pm-border transition-colors">
            <div onClick={onClick} className="flex items-center space-x-2 truncate cursor-pointer flex-grow min-w-0">
                <IssueTypeIcon type={issue.type} />
                <p className="text-sm truncate" title={issue.summary}>{issue.summary}</p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                <button className="text-xs text-pm-text-secondary opacity-0 group-hover:opacity-100 hover:text-pm-blue transition-opacity focus:opacity-100">Log time</button>
                <span className="text-xs text-pm-text-secondary">{issue.key}</span>
            </div>
        </div>
    );
};

const MyWorkWidget: React.FC<MyWorkWidgetProps> = ({ currentUser, issues, onIssueClick }) => {
    const myOpenIssues = issues.filter(
        issue => issue.assignees.some(a => a.id === currentUser.id) && issue.status !== 'Done'
    );

    const groupedByStatus = myOpenIssues.reduce((acc, issue) => {
        const status = issue.status || 'None';
        (acc[status] = acc[status] || []).push(issue);
        return acc;
    }, {} as Record<string, Issue[]>);

    const statusOrder = ['In Progress', 'To Do', 'Backlog'];

    return (
        <div className="h-full overflow-y-auto">
            {myOpenIssues.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-pm-text-secondary">
                    You have no open issues. Great job!
                </div>
            ) : (
                <div className="space-y-4">
                    {statusOrder.map(status => {
                        if (groupedByStatus[status]?.length > 0) {
                            return (
                                <div key={status}>
                                    <h3 className="text-xs font-semibold uppercase text-pm-text-secondary px-2 mb-1">{status}</h3>
                                    <div className="space-y-1">
                                        {groupedByStatus[status].map(issue => (
                                            <IssueRow key={issue.id} issue={issue} onClick={() => onIssueClick(issue)} />
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default MyWorkWidget;
