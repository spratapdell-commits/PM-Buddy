import React, { useState } from 'react';
import { User, Notification } from '../types';
import { BellIcon, QuestionMarkCircleIcon } from './Icons';

interface HeaderProps {
    currentUser: User;
    notifications: Notification[];
    onNavigate: (view: 'account' | 'admin') => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, notifications, onNavigate, onLogout }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <header className="flex-shrink-0 h-14 bg-pm-dark-secondary border-b border-pm-border flex items-center justify-end px-6">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full text-pm-text-secondary hover:bg-pm-border hover:text-pm-text">
                        <BellIcon className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-pm-blue ring-2 ring-pm-dark-secondary"></span>
                        )}
                    </button>
                     {isNotificationsOpen && (
                        <div 
                            onMouseLeave={() => setIsNotificationsOpen(false)}
                            className="absolute right-0 mt-2 w-80 bg-pm-dark border border-pm-border rounded-md shadow-lg z-20"
                        >
                            <div className="p-2 font-semibold border-b border-pm-border">Notifications</div>
                            <ul className="py-1 max-h-80 overflow-y-auto">
                                {notifications.map(n => (
                                    <li key={n.id} className="px-3 py-2 text-sm text-pm-text-secondary">{n.message}</li>
                                ))}
                                {notifications.length === 0 && <li className="px-3 py-4 text-sm text-center text-pm-text-secondary">No new notifications</li>}
                            </ul>
                        </div>
                    )}
                </div>
                <button className="p-2 rounded-full text-pm-text-secondary hover:bg-pm-border hover:text-pm-text">
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                </button>
                <div className="relative">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                    </button>
                    {isUserMenuOpen && (
                        <div
                            onMouseLeave={() => setIsUserMenuOpen(false)} 
                            className="absolute right-0 mt-2 w-48 bg-pm-dark border border-pm-border rounded-md shadow-lg z-20"
                        >
                            <div className="px-4 py-3 border-b border-pm-border">
                                <p className="text-sm font-semibold">{currentUser.name}</p>
                                <p className="text-xs text-pm-text-secondary truncate">{currentUser.email}</p>
                            </div>
                            <ul className="py-1">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('account'); setIsUserMenuOpen(false); }} className="block px-4 py-2 text-sm text-pm-text hover:bg-pm-border">My Account</a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('admin'); setIsUserMenuOpen(false); }} className="block px-4 py-2 text-sm text-pm-text hover:bg-pm-border">Settings</a></li>
                                <li className="border-t border-pm-border my-1"></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-pm-text hover:bg-pm-border">Log out</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;