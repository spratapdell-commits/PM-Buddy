import React, { useState } from 'react';
import { Project } from '../../types';
import { XMarkIcon } from '../Icons';

interface EditProjectModalProps {
    project: Project;
    onClose: () => void;
    onSave: (updatedProject: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose, onSave }) => {
    const [name, setName] = useState(project.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ ...project, name });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Edit Project Details</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-pm-text-secondary mb-1">Project Name</label>
                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            value={project.key}
                            disabled
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm disabled:opacity-50"
                        />
                         <p className="text-xs text-pm-text-secondary mt-1">The project key cannot be changed after creation.</p>
                    </div>
                </div>
                <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold">Save Changes</button>
                </footer>
            </form>
        </div>
    );
};

export default EditProjectModal;