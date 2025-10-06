import React from 'react';
import { Version, Issue, IssueType } from '../../types';
import { XMarkIcon, BugIcon, StoryIcon, TaskIcon } from '../Icons';

interface ReleaseNotesModalProps {
    version: Version;
    issues: Issue[];
    onClose: () => void;
}

const IssueTypeIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
      case 'Story': return <StoryIcon className="w-4 h-4 text-pm-green" />;
      case 'Task': return <TaskIcon className="w-4 h-4 text-pm-blue" />;
      case 'Bug': return <BugIcon className="w-4 h-4 text-pm-red" />;
      default: return null;
    }
  };

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ version, issues, onClose }) => {
    const groupedIssues = issues.reduce((acc, issue) => {
        const type = issue.type || 'Task';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(issue);
        return acc;
    }, {} as Record<IssueType, Issue[]>);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold">Release Notes: {version.name}</h2>
                        <p className="text-sm text-pm-text-secondary">{version.description}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 overflow-y-auto">
                    {Object.entries(groupedIssues).map(([type, issueList]) => (
                        <div key={type} className="mb-6">
                            <h3 className="font-bold text-xl mb-3">{type}s</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {issueList.map(issue => (
                                    <li key={issue.id} className="flex items-start space-x-2">
                                        <div className="flex-shrink-0 pt-1"><IssueTypeIcon type={issue.type} /></div>
                                        <span>
                                            <span className="text-pm-text-secondary">{issue.key}</span> {issue.summary}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {issues.length === 0 && (
                        <p className="text-pm-text-secondary">No issues are associated with this release yet.</p>
                    )}
                </div>
                 <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default ReleaseNotesModal;
