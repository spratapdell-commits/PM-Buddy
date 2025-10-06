
import React from 'react';
import { QueuedAction } from '../../types';
import { XMarkIcon } from '../Icons';

interface ConflictResolutionModalProps {
    action: QueuedAction;
    onClose: () => void;
    // onResolve: (resolution: 'retry' | 'keep' | 'discard') => void;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({ action, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold text-pm-orange">Action Conflict</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <p className="text-sm">The action you tried to perform while offline could not be completed because the data has changed on the server.</p>
                    <div>
                        <p className="text-xs font-semibold text-pm-text-secondary uppercase mb-1">Failed Action</p>
                         <div className="bg-pm-dark p-3 rounded-lg border border-pm-border">
                            <p className="font-semibold text-sm">{action.type}</p>
                            <pre className="text-xs text-pm-text-secondary mt-2 bg-black/20 p-2 rounded-md overflow-x-auto">
                                {JSON.stringify(action.payload, null, 2)}
                            </pre>
                        </div>
                    </div>
                     <div>
                        <p className="text-xs font-semibold text-pm-text-secondary uppercase mb-1">Server Error</p>
                        <div className="bg-pm-red/10 border border-pm-red/20 rounded-md p-3">
                            <p className="text-xs text-pm-red font-semibold">{action.error || 'The item was modified by another user.'}</p>
                        </div>
                    </div>
                </div>
                 <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-pm-red text-white">Discard My Changes</button>
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Keep Server Version</button>
                    <button type="button" className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold">Retry</button>
                </footer>
            </div>
        </div>
    );
};

export default ConflictResolutionModal;
