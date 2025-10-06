
import React from 'react';
import { XMarkIcon } from '../Icons';

interface ConfigureWidgetModalProps {
    onClose: () => void;
}

const ConfigureWidgetModal: React.FC<ConfigureWidgetModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-md flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Configure Widget</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6">
                    <p className="text-pm-text-secondary">Configuration options for this widget will appear here.</p>
                </div>
                 <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold">Save</button>
                </footer>
            </div>
        </div>
    );
};

export default ConfigureWidgetModal;
