
import React from 'react';
import { XMarkIcon } from '../Icons';

const DrilldownModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-2xl flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Drilldown View</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6">
                    <p className="text-pm-text-secondary">A detailed view of the data points for this report would appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default DrilldownModal;
