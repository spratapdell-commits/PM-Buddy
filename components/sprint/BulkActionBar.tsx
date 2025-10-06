
import React, { useState } from 'react';
import { Project } from '../../types';
import { XMarkIcon, ChevronDownIcon } from '../Icons';

interface BulkActionBarProps {
    selectedCount: number;
    project: Project;
    onClear: () => void;
    // onBulkUpdate: (updates: Partial<Issue>) => void; // For a real implementation
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, project, onClear }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-pm-dark-secondary border border-pm-border rounded-lg shadow-2xl flex items-center space-x-4 p-2 z-30">
            <span className="px-2 font-semibold text-sm">{selectedCount} selected</span>
            
            <div className="relative">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-1 text-sm px-3 py-1.5 rounded-md hover:bg-pm-border"
                >
                    <span>Actions</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </button>
                {isMenuOpen && (
                    <div 
                        onMouseLeave={() => setIsMenuOpen(false)}
                        className="absolute bottom-full mb-2 w-48 bg-pm-dark-secondary border border-pm-border rounded-md shadow-lg"
                    >
                         <ul className="py-1 text-sm">
                             <li><a href="#" className="block px-4 py-2 hover:bg-pm-border">Move to sprint...</a></li>
                             <li><a href="#" className="block px-4 py-2 hover:bg-pm-border">Change status...</a></li>
                             <li><a href="#" className="block px-4 py-2 hover:bg-pm-border">Assign to...</a></li>
                             <li className="border-t border-pm-border my-1"></li>
                             <li><a href="#" className="block px-4 py-2 hover:bg-pm-border text-pm-red">Delete</a></li>
                         </ul>
                    </div>
                )}
            </div>

            <button onClick={onClear} className="p-2 rounded-full hover:bg-pm-border text-pm-text-secondary">
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default BulkActionBar;
