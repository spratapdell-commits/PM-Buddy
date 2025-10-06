import React, { useState } from 'react';
import { Project } from '../../types';
import { XMarkIcon } from '../Icons';

interface DeleteProjectModalProps {
    project: Project;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({ project, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState('');
    
    const isConfirmed = confirmText === project.name;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold text-pm-red">Delete Project</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <p>This action is irreversible. All issues, sprints, and settings associated with the <strong>{project.name}</strong> project will be permanently deleted.</p>
                    <p>Please type <strong className="text-pm-red">{project.name}</strong> to confirm.</p>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"
                    />
                </div>
                <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Cancel</button>
                    <button
                        onClick={onConfirm}
                        disabled={!isConfirmed}
                        className="px-4 py-2 text-sm rounded-md bg-pm-red text-white font-semibold disabled:bg-pm-red/50 disabled:cursor-not-allowed"
                    >
                        Delete Project
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DeleteProjectModal;