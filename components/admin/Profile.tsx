import React from 'react';
import { User } from '../../types';
import { GoogleIcon, GitHubIcon } from '../Icons';

interface ProfileProps {
    currentUser: User;
    onUserUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onUserUpdate }) => {

    const handleLink = (provider: 'google' | 'github') => {
        // --- In a real application ---
        // This would initiate the OAuth flow to link the account.
        // window.location.href = `/api/auth/link/${provider}`;
        
        // --- Simulation ---
        alert(`Simulating linking of ${provider} account...`);
        setTimeout(() => {
            const updatedUser = {
                ...currentUser,
                [`${provider}Id`]: `${provider}-linked-${Date.now()}`,
            };
            onUserUpdate(updatedUser);
        }, 1000);
    };
    
    const handleUnlink = (provider: 'google' | 'github') => {
        // --- In a real application ---
        // This would call a backend endpoint to remove the provider link.
        // fetch(`/api/auth/unlink/${provider}`, { method: 'POST' });

        // --- Simulation ---
        alert(`Simulating unlinking of ${provider} account...`);
        // FIX: Replaced dynamic property destructuring with explicit, type-safe destructuring to resolve index signature error.
        if (provider === 'google') {
            const { googleId, ...rest } = currentUser;
            onUserUpdate(rest);
        } else {
            const { githubId, ...rest } = currentUser;
            onUserUpdate(rest);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            <p className="text-pm-text-secondary mb-6">Manage your personal settings and linked accounts.</p>

            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border max-w-2xl">
                <div className="p-6">
                    <div className="flex items-center space-x-4">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-16 h-16 rounded-full" />
                        <div>
                            <h2 className="text-xl font-bold">{currentUser.name}</h2>
                            <p className="text-pm-text-secondary">{currentUser.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border max-w-2xl mt-6">
                 <div className="p-6">
                    <h2 className="font-semibold mb-4 text-lg">Linked Accounts</h2>
                    <p className="text-sm text-pm-text-secondary mb-4">Connect your Google or GitHub accounts to sign in to PM Buddy.</p>
                    <ul className="space-y-3">
                        {/* Google Account */}
                        <li className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                <GoogleIcon className="w-6 h-6" />
                                <span className="font-medium">Google</span>
                             </div>
                             {currentUser.googleId ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-pm-text-secondary">Connected</span>
                                    <button onClick={() => handleUnlink('google')} className="text-sm text-pm-red hover:underline">Unlink</button>
                                </div>
                             ) : (
                                <button onClick={() => handleLink('google')} className="text-sm font-medium text-pm-blue hover:underline">Connect</button>
                             )}
                        </li>
                        {/* GitHub Account */}
                        <li className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                <GitHubIcon className="w-6 h-6" />
                                <span className="font-medium">GitHub</span>
                             </div>
                             {currentUser.githubId ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-pm-text-secondary">Connected</span>
                                    <button onClick={() => handleUnlink('github')} className="text-sm text-pm-red hover:underline">Unlink</button>
                                </div>
                             ) : (
                                <button onClick={() => handleLink('github')} className="text-sm font-medium text-pm-blue hover:underline">Connect</button>
                             )}
                        </li>
                    </ul>
                     {/* 
                        Developer Note:
                        In a production backend, OAuth credentials must be stored securely.
                        NEVER commit them to your repository.
                        
                        Example .env:
                        GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
                        GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
                        GITHUB_OAUTH_CLIENT_ID=your_github_client_id
                        GITHUB_OAUTH_CLIENT_SECRET=your_github_client_secret
                     */}
                </div>
            </div>
        </div>
    );
};

export default Profile;