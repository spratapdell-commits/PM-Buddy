import React, { useState } from 'react';
import { Version } from '../../types';
import { XMarkIcon } from '../Icons';

interface CreateReleaseModalProps {
    onClose: () => void;
    onCreate: (newVersion: Omit<Version, 'id' | 'issueIds' | 'status'>) => void;
}

const CreateReleaseModal: React.FC<CreateReleaseModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate({ name, description, releaseDate: releaseDate || undefined });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Create Release</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="releaseName" className="block text-sm font-medium text-pm-text-secondary mb-1">Version name</label>
                        <input
                            id="releaseName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., v2.1.0 - Performance Update"
                            required
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="releaseDate" className="block text-sm font-medium text-pm-text-secondary mb-1">Release date (optional)</label>
                        <input
                            id="releaseDate"
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-pm-text-secondary mb-1">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Describe the main goals of this release..."
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
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

export default CreateReleaseModal;
