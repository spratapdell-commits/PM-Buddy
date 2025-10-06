
import React from 'react';
import { XMarkIcon } from '../Icons';

interface ShareDashboardModalProps {
    onClose: () => void;
}

const ShareDashboardModal: React.FC<ShareDashboardModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                 <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Share Dashboard</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6">
                    <p className="text-pm-text-secondary">Sharing options will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default ShareDashboardModal;
