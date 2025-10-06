
import React from 'react';
// FIX: Changed import from WidgetType to Widget as WidgetType is not exported.
// FIX: Changed import to be relative
import { Widget } from '../../types';
// FIX: Changed import to be relative
import { XMarkIcon, UserIcon, ChartIcon } from '../Icons';

interface AddWidgetModalProps {
    onClose: () => void;
    // FIX: Updated prop to use Widget['type'] for correctness.
    onAddWidget: (type: Widget['type']) => void;
}

const WIDGET_OPTIONS = [
    { type: 'my-work', title: 'My Work', description: 'Shows issues assigned to you.', icon: <UserIcon className="w-6 h-6" /> },
    { type: 'sprint-burndown', title: 'Sprint Burndown', description: 'Tracks progress in the active sprint.', icon: <ChartIcon className="w-6 h-6" /> },
    { type: 'cumulative-flow', title: 'Cumulative Flow', description: 'Shows issue status over time.', icon: <ChartIcon className="w-6 h-6" /> },
] as const;

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({ onClose, onAddWidget }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-2xl flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Add a widget</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {WIDGET_OPTIONS.map(opt => (
                        <button key={opt.type} onClick={() => onAddWidget(opt.type)} className="text-left p-4 bg-pm-dark rounded-lg border border-pm-border hover:border-pm-blue hover:bg-pm-blue/10 transition-colors">
                            <div className="text-pm-blue mb-2">{opt.icon}</div>
                            <h3 className="font-semibold">{opt.title}</h3>
                            <p className="text-sm text-pm-text-secondary">{opt.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddWidgetModal;
