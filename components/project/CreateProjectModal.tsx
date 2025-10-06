import React, { useState } from 'react';
import { Project, User } from '../types';
import { XMarkIcon } from '../Icons';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreate: (newProject: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !key.trim()) return;

        const newProject: Project = {
            id: `p-${Date.now()}`,
            name,
            key: key.toUpperCase(),
            avatarUrl: `https://i.pravatar.cc/150?u=p-${Date.now()}`,
            columns: [
                { id: 'col-1', title: 'To Do', issueIds: [] },
                { id: 'col-2', title: 'In Progress', issueIds: [] },
                { id: 'col-3', title: 'Done', issueIds: [] },
            ],
            issues: [],
            sprints: [],
            versions: [],
            dashboards: [],
        };

        onCreate(newProject);
    };
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        // Auto-generate key
        if (key.length <= 1) {
            setKey(newName.split(' ').map(word => word[0]).join('').slice(0, 3).toUpperCase());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Create Project</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-pm-text-secondary mb-1">Project Name</label>
                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="e.g., Mobile App"
                            required
                            autoFocus
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
                    </div>
                     <div>
                        <label htmlFor="projectKey" className="block text-sm font-medium text-pm-text-secondary mb-1">Project Key</label>
                        <input
                            id="projectKey"
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value.toUpperCase())}
                            maxLength={4}
                            required
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"
                        />
                        <p className="text-xs text-pm-text-secondary mt-1">This is the unique identifier for your project's issues.</p>
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

export default CreateProjectModal;