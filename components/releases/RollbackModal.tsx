
import React from 'react';
import { XMarkIcon } from '../Icons';
import { Version } from '../../types';

interface RollbackModalProps {
    version: Version;
    onClose: () => void;
    onConfirm: () => void;
}

const RollbackModal: React.FC<RollbackModalProps> = ({ version, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold text-pm-red">Confirm Rollback</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6">
                    <p>Are you sure you want to roll back the release of <strong>{version.name}</strong>?</p>
                    <p className="text-sm text-pm-text-secondary mt-2">This will revert the production environment to the previously deployed version. This action cannot be undone easily.</p>
                </div>
                <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-md bg-pm-red text-white font-semibold">Confirm Rollback</button>
                </footer>
            </div>
        </div>
    );
};

export default RollbackModal;
