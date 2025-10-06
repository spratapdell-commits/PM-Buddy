
import React from 'react';
// FIX: Changed import to be relative
import { CogIcon, TrashIcon } from '../Icons';

interface WidgetWrapperProps {
    title: string;
    children: React.ReactNode;
    onRemove: () => void;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ title, children, onRemove }) => {
    return (
        <div className="bg-pm-dark-secondary rounded-lg border border-pm-border h-full flex flex-col">
            <header className="drag-handle flex items-center justify-between p-2 border-b border-pm-border cursor-move">
                <h2 className="text-sm font-semibold">{title}</h2>
                <div className="flex items-center space-x-1">
                    <button className="p-1 rounded hover:bg-pm-border text-pm-text-secondary"><CogIcon className="w-4 h-4" /></button>
                    <button onClick={onRemove} className="p-1 rounded hover:bg-pm-border text-pm-text-secondary hover:text-pm-red"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </header>
            <main className="flex-1 p-2 overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default WidgetWrapper;
