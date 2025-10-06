
import React from 'react';
import { AccountView } from './Account';
import { UserIcon, LinkIcon, ShieldCheckIcon, BellAlertIcon, ExclamationTriangleIcon } from '../Icons';

interface AccountLayoutProps {
    currentView: AccountView;
    onNavigate: (view: AccountView) => void;
    onNavigateBack: () => void;
    children: React.ReactNode;
}

const navItems: { id: AccountView, label: string, icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5 mr-3" /> },
    { id: 'linked', label: 'Linked Accounts', icon: <LinkIcon className="w-5 h-5 mr-3" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="w-5 h-5 mr-3" /> },
    { id: 'preferences', label: 'Preferences', icon: <BellAlertIcon className="w-5 h-5 mr-3" /> },
    { id: 'danger', label: 'Danger Zone', icon: <ExclamationTriangleIcon className="w-5 h-5 mr-3" /> },
];

const AccountLayout: React.FC<AccountLayoutProps> = ({ currentView, onNavigate, onNavigateBack, children }) => {
    return (
        <div className="flex flex-col h-full bg-pm-dark text-pm-text">
            <header className="flex items-center justify-between pb-4 border-b border-pm-border flex-shrink-0">
                <h1 className="text-2xl font-bold">My Account</h1>
                <button onClick={onNavigateBack} className="text-sm text-pm-blue hover:underline">
                    Back to Project
                </button>
            </header>
            <div className="flex flex-1 overflow-hidden mt-6">
                <aside className="w-64 flex-shrink-0 pr-8">
                    <nav className="space-y-1">
                        {navItems.map(item => (
                            <a
                                key={item.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                                className={`flex items-center px-3 py-2 text-sm rounded-md ${currentView === item.id ? 'bg-pm-border font-semibold' : 'hover:bg-pm-border/50'}`}
                            >
                                {item.icon}
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AccountLayout;