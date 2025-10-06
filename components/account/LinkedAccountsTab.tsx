
import React from 'react';
import { User } from '../../types';
import { GoogleIcon, GitHubIcon } from '../Icons';

interface LinkedAccountsTabProps {
    currentUser: User;
    onUserUpdate: (user: User) => void;
}

const LinkedAccountsTab: React.FC<LinkedAccountsTabProps> = ({ currentUser, onUserUpdate }) => {
    
    const handleLink = (provider: 'google' | 'github') => {
        // --- In a real app ---
        // window.location.href = `/api/auth/link/${provider}`;
        alert(`Simulating linking of ${provider} account...`);
        setTimeout(() => {
            onUserUpdate({ ...currentUser, [`${provider}Id`]: `${provider}-linked-${Date.now()}` });
        }, 1000);
    };

    const handleUnlink = (provider: 'google' | 'github') => {
        if (!currentUser.googleId && !currentUser.githubId) {
            alert("You cannot unlink the last sign-in method.");
            return;
        }
        alert(`Simulating unlinking of ${provider} account...`);
        if (provider === 'google') {
            const { googleId, ...rest } = currentUser;
            onUserUpdate(rest);
        } else {
            const { githubId, ...rest } = currentUser;
            onUserUpdate(rest);
        }
    };
    
    return (
        <div className="max-w-3xl">
            <h1 className="text-xl font-bold mb-1">Linked Accounts</h1>
            <p className="text-pm-text-secondary mb-6">Connect your social accounts to sign in to PM Buddy.</p>

            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <ul className="divide-y divide-pm-border">
                    {/* Google */}
                    <li className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <GoogleIcon className="w-8 h-8"/>
                            <div>
                                <h3 className="font-semibold">Google</h3>
                                <p className="text-sm text-pm-text-secondary">
                                    {currentUser.googleId ? 'Connected' : 'Not connected'}
                                </p>
                            </div>
                        </div>
                        {currentUser.googleId ? (
                            <button onClick={() => handleUnlink('google')} className="px-3 py-1.5 text-sm rounded-md border border-pm-red text-pm-red hover:bg-pm-red/10">
                                Disconnect
                            </button>
                        ) : (
                            <button onClick={() => handleLink('google')} className="px-3 py-1.5 text-sm rounded-md border border-pm-border hover:bg-pm-border">
                                Connect
                            </button>
                        )}
                    </li>
                    {/* GitHub */}
                     <li className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <GitHubIcon className="w-8 h-8"/>
                            <div>
                                <h3 className="font-semibold">GitHub</h3>
                                <p className="text-sm text-pm-text-secondary">
                                    {currentUser.githubId ? 'Connected' : 'Not connected'}
                                </p>
                            </div>
                        </div>
                        {currentUser.githubId ? (
                             <button onClick={() => handleUnlink('github')} className="px-3 py-1.5 text-sm rounded-md border border-pm-red text-pm-red hover:bg-pm-red/10">
                                Disconnect
                            </button>
                        ) : (
                             <button onClick={() => handleLink('github')} className="px-3 py-1.5 text-sm rounded-md border border-pm-border hover:bg-pm-border">
                                Connect
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LinkedAccountsTab;