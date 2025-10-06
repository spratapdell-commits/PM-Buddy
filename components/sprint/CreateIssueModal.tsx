
import React, { useState } from 'react';
import { Project, User, Issue, IssueType, IssuePriority } from '../../types';
import { XMarkIcon } from '../Icons';

interface CreateIssueModalProps {
    project: Project;
    currentUser: User;
    onClose: () => void;
    onSave: (issue: Issue) => void;
}

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({ project, currentUser, onClose, onSave }) => {
    const [summary, setSummary] = useState('');
    const [type, setType] = useState<IssueType>(IssueType.TASK);
    const [priority, setPriority] = useState<IssuePriority>(IssuePriority.MEDIUM);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!summary.trim()) return;

        const newIssue: Issue = {
            id: `i-${Date.now()}`,
            key: `${project.key}-${Math.floor(Math.random() * 900) + 100}`, // Mock key generation
            summary,
            description: '',
            type,
            priority,
            status: 'Backlog',
            assignees: [],
            reporterId: currentUser.id,
            labels: [],
            storyPoints: null,
            comments: [],
            attachments: [],
            history: [],
            rank: new Date().toISOString(), // Mock rank
        };

        onSave(newIssue);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Create Issue</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="summary" className="block text-sm font-medium text-pm-text-secondary mb-1">Summary</label>
                        <input
                            id="summary"
                            type="text"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="type" className="block text-sm font-medium text-pm-text-secondary mb-1">Issue Type</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value as IssueType)}
                                className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                            >
                                {Object.values(IssueType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                         <div>
                           <label htmlFor="priority" className="block text-sm font-medium text-pm-text-secondary mb-1">Priority</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                                className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                            >
                                 {Object.values(IssuePriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold">Create</button>
                </footer>
            </form>
        </div>
    );
};

export default CreateIssueModal;
