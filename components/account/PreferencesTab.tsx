
import React, { useState } from 'react';
import { User } from '../../types';

interface PreferencesTabProps {
    currentUser: User;
    onUserUpdate: (user: User) => void;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({ currentUser, onUserUpdate }) => {
    const [theme, setTheme] = useState(currentUser.themePreference || 'auto');
    const [notifications, setNotifications] = useState(
        currentUser.notifications || { task_updates: false, weekly_digest: false }
    );
    
    const handleSave = () => {
        onUserUpdate({ ...currentUser, themePreference: theme, notifications });
        alert("Preferences saved!");
    };
    
    const hasChanges = theme !== (currentUser.themePreference || 'auto') || 
                       notifications.task_updates !== (currentUser.notifications?.task_updates || false) ||
                       notifications.weekly_digest !== (currentUser.notifications?.weekly_digest || false);

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-xl font-bold mb-1">Preferences</h1>
                <p className="text-pm-text-secondary mb-6">Customize your experience.</p>
            </div>

            {/* Theme */}
             <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <header className="p-6 border-b border-pm-border">
                    <h2 className="font-semibold text-lg">Theme</h2>
                    <p className="text-sm text-pm-text-secondary">Choose how PM Buddy looks to you.</p>
                </header>
                <div className="p-6">
                    <fieldset className="space-y-2">
                        <div className="flex items-center">
                            <input id="theme-auto" name="theme" type="radio" checked={theme === 'auto'} onChange={() => setTheme('auto')} className="h-4 w-4 text-pm-blue border-pm-border bg-pm-dark" />
                            <label htmlFor="theme-auto" className="ml-3 block text-sm">Automatic</label>
                        </div>
                         <div className="flex items-center">
                            <input id="theme-dark" name="theme" type="radio" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="h-4 w-4 text-pm-blue border-pm-border bg-pm-dark" />
                            <label htmlFor="theme-dark" className="ml-3 block text-sm">Dark</label>
                        </div>
                         <div className="flex items-center">
                            <input id="theme-light" name="theme" type="radio" checked={theme === 'light'} onChange={() => setTheme('light')} className="h-4 w-4 text-pm-blue border-pm-border bg-pm-dark" />
                            <label htmlFor="theme-light" className="ml-3 block text-sm">Light</label>
                        </div>
                    </fieldset>
                </div>
            </div>

             {/* Notifications */}
             <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <header className="p-6 border-b border-pm-border">
                    <h2 className="font-semibold text-lg">Email Notifications</h2>
                    <p className="text-sm text-pm-text-secondary">We'll only send emails for things that matter.</p>
                </header>
                <div className="p-6 space-y-4">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="task-updates" name="task-updates" type="checkbox" checked={notifications.task_updates} onChange={e => setNotifications({...notifications, task_updates: e.target.checked})} className="focus:ring-pm-blue h-4 w-4 text-pm-blue border-pm-border rounded bg-pm-dark" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="task-updates" className="font-medium">Task Updates</label>
                            <p className="text-pm-text-secondary">Get notified when someone assigns you an issue or mentions you in a comment.</p>
                        </div>
                    </div>
                     <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="weekly-digest" name="weekly-digest" type="checkbox" checked={notifications.weekly_digest} onChange={e => setNotifications({...notifications, weekly_digest: e.target.checked})} className="focus:ring-pm-blue h-4 w-4 text-pm-blue border-pm-border rounded bg-pm-dark" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="weekly-digest" className="font-medium">Weekly Digest</label>
                            <p className="text-pm-text-secondary">Receive a summary of project activity once a week.</p>
                        </div>
                    </div>
                </div>
                 <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end">
                    <button onClick={handleSave} disabled={!hasChanges} className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold disabled:bg-pm-blue/50">Save Preferences</button>
                </footer>
            </div>
        </div>
    );
};

export default PreferencesTab;