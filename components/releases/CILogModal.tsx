
import React from 'react';
import { XMarkIcon } from '../Icons';

interface CILogModalProps {
    onClose: () => void;
    log: string;
}

const CILogModal: React.FC<CILogModalProps> = ({ onClose, log }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border flex-shrink-0">
                    <h2 className="text-lg font-semibold">CI/CD Logs</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-4 overflow-y-auto flex-1">
                    <pre className="text-xs font-mono bg-pm-dark p-4 rounded-md h-full overflow-auto">
                        {log}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default CILogModal;
