import React, { useState } from 'react';
import { Project, User, QueuedAction } from '../../types';
import { HomeIcon, BoardIcon, PlusIcon, UserCircleIcon, ChevronLeftIcon } from '../Icons';
import MobileHome from './MobileHome';
import MobileBoard from './MobileBoard';
import MobileCreateIssue from './MobileCreateIssue';
import MobileOfflineQueue from './MobileOfflineQueue';

type MobileView = 'home' | 'board' | 'create' | 'profile';

interface MobileLayoutProps {
    project: Project;
    currentUser: User;
    queuedActions: QueuedAction[];
    setQueuedActions: React.Dispatch<React.SetStateAction<QueuedAction[]>>;
    onExitMobileView: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ project, currentUser, queuedActions, setQueuedActions, onExitMobileView }) => {
    const [view, setView] = useState<MobileView>('home');

    const renderView = () => {
        switch (view) {
            case 'home':
                return <MobileHome project={project} currentUser={currentUser} />;
            case 'board':
                return <MobileBoard project={project} />;
            case 'create':
                return <MobileCreateIssue project={project} currentUser={currentUser} onIssueCreated={() => setView('board')} />;
            case 'profile':
                return <div className="p-4"><h1 className="text-xl font-bold">Profile</h1><p>{currentUser.name}</p></div>;
            default:
                return <MobileHome project={project} currentUser={currentUser} />;
        }
    };

    return (
        <div className="w-full h-screen max-w-md mx-auto bg-pm-dark flex flex-col font-sans text-pm-text shadow-2xl ring-1 ring-pm-border">
            {/* Header */}
            <header className="flex items-center justify-between p-3 border-b border-pm-border flex-shrink-0">
                <button onClick={onExitMobileView} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary flex items-center space-x-1 text-sm">
                    <ChevronLeftIcon className="w-5 h-5"/>
                    <span>Desktop</span>
                </button>
                <h1 className="font-semibold">{project.name}</h1>
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                {renderView()}
            </main>

            {/* Offline Queue UI */}
            <MobileOfflineQueue queuedActions={queuedActions} setQueuedActions={setQueuedActions} />

            {/* Bottom Navigation */}
            <nav className="flex items-center justify-around bg-pm-dark-secondary border-t border-pm-border flex-shrink-0">
                <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Home" isActive={view === 'home'} onClick={() => setView('home')} />
                <NavItem icon={<BoardIcon className="w-6 h-6" />} label="Board" isActive={view === 'board'} onClick={() => setView('board')} />
                <NavItem icon={<PlusIcon className="w-8 h-8 p-1 bg-pm-blue text-white rounded-full" />} label="Create" isActive={view === 'create'} onClick={() => setView('create')} />
                <NavItem icon={<UserCircleIcon className="w-6 h-6" />} label="Profile" isActive={view === 'profile'} onClick={() => setView('profile')} />
            </nav>
        </div>
    );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 w-1/4 ${isActive ? 'text-pm-blue' : 'text-pm-text-secondary'} hover:text-pm-blue transition-colors`}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

export default MobileLayout;