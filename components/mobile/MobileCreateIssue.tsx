import React from 'react';
import { Project, User } from '../../types';

interface MobileCreateIssueProps {
    project: Project;
    currentUser: User;
    onIssueCreated: () => void;
}

const MobileCreateIssue: React.FC<MobileCreateIssueProps> = ({ onIssueCreated }) => {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Create Issue</h1>
            <p className="text-pm-text-secondary mb-4">A simplified, mobile-first form for creating new issues will be implemented here.</p>
            <button 
                onClick={onIssueCreated}
                className="w-full bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold"
            >
                Create
            </button>
        </div>
    );
};

export default MobileCreateIssue;