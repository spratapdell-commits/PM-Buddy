import React, { useState } from 'react';
import { QueuedAction } from '../../types';
import { XMarkIcon } from '../Icons';

interface MobileOfflineQueueProps {
    queuedActions: QueuedAction[];
    setQueuedActions: React.Dispatch<React.SetStateAction<QueuedAction[]>>;
}

const MobileOfflineQueue: React.FC<MobileOfflineQueueProps> = ({ queuedActions }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pendingCount = queuedActions.filter(a => a.status === 'pending').length;

    if (pendingCount === 0) return null;

    return (<>
        <div onClick={() => setIsModalOpen(true)} className="bg-pm-orange/20 text-pm-orange px-4 py-2 text-sm text-center cursor-pointer flex-shrink-0">
            You are offline. {pendingCount} action{pendingCount > 1 ? 's' : ''} queued.
        </div>
        {isModalOpen && <QueueModal actions={queuedActions} onClose={() => setIsModalOpen(false)} />}
    </>);
};

const QueueModal: React.FC<{actions: QueuedAction[], onClose: () => void}> = ({ actions, onClose }) => (
     <div className="absolute inset-0 bg-black/70 flex items-end" onClick={onClose}>
        <div className="bg-pm-dark-secondary w-full rounded-t-lg shadow-xl flex flex-col border-t border-pm-border max-h-[60vh]" onClick={e => e.stopPropagation()}>
             <header className="flex items-center justify-between p-4 border-b border-pm-border flex-shrink-0">
                <h2 className="text-lg font-semibold">Offline Queue</h2>
                <button onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
            </header>
            <div className="p-4 overflow-y-auto space-y-3">
                {actions.map(action => (
                    <div key={action.id} className="bg-pm-dark p-3 rounded-lg border border-pm-border">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm">{action.type}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                action.status === 'pending' ? 'bg-pm-blue/20 text-pm-blue' :
                                action.status === 'failed' ? 'bg-pm-red/20 text-pm-red' : 'bg-pm-orange/20 text-pm-orange'
                            }`}>{action.status}</span>
                        </div>
                        <pre className="text-xs text-pm-text-secondary mt-2 bg-black/20 p-2 rounded-md overflow-x-auto">
                            {JSON.stringify(action.payload, null, 2)}
                        </pre>
                        {action.status === 'failed' && (
                            <div className="mt-2 p-2 bg-pm-red/10 border border-pm-red/20 rounded-md">
                                <p className="text-xs text-pm-red font-semibold">Error: {action.error}</p>
                                {/* Placeholder for conflict resolution UI */}
                                <div className="mt-1 flex space-x-2">
                                    <button className="text-xs text-pm-blue hover:underline">Retry</button>
                                    <button className="text-xs text-pm-text-secondary hover:underline">Discard</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
)

export default MobileOfflineQueue;