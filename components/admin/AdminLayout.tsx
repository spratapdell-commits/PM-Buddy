import React from 'react';

type AdminView = 'profile' | 'members' | 'roles' | 'sso' | 'audit' | 'automation' | 'workflows';

interface AdminLayoutProps {
    currentView: AdminView;
    onNavigate: (view: AdminView) => void;
    onNavigateBack: () => void;
    children: React.ReactNode;
}

const navItems: { id: AdminView, label: string }[] = [
    { id: 'profile', label: 'Profile & Security' },
    { id: 'members', label: 'Members' },
    { id: 'roles', label: 'Roles & Permissions' },
    { id: 'sso', label: 'Single Sign-On' },
    { id: 'audit', label: 'Audit Logs' },
    { id: 'automation', label: 'Automation' },
    { id: 'workflows', label: 'Workflows' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ currentView, onNavigate, onNavigateBack, children }) => {
    return (
        <div className="flex flex-col h-full bg-pm-dark text-pm-text">
            <header className="flex items-center justify-between p-4 border-b border-pm-border flex-shrink-0">
                <h1 className="text-xl font-bold">Project Settings</h1>
                <button onClick={onNavigateBack} className="text-sm text-pm-blue hover:underline">
                    Back to Project
                </button>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-pm-dark-secondary p-4 border-r border-pm-border">
                    <nav className="space-y-2">
                        {navItems.map(item => (
                            <a
                                key={item.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                                className={`block px-3 py-2 text-sm rounded-md ${currentView === item.id ? 'bg-pm-blue text-white' : 'hover:bg-pm-border'}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
