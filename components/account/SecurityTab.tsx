
import React, { useState } from 'react';

const SecurityTab: React.FC = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    
    // Mock data
    const activeSessions = [
        { id: 'sess-1', browser: 'Chrome on macOS', ip: '192.168.1.100', lastSeen: 'now', isCurrent: true },
        { id: 'sess-2', browser: 'Safari on iPhone', ip: '8.8.8.8', lastSeen: '2 hours ago', isCurrent: false },
    ];

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-xl font-bold mb-1">Security</h1>
                <p className="text-pm-text-secondary mb-6">Manage your password, two-factor authentication, and active sessions.</p>
            </div>
            
            {/* Change Password */}
            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <header className="p-6 border-b border-pm-border">
                    <h2 className="font-semibold text-lg">Change Password</h2>
                </header>
                <form className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-pm-text-secondary mb-1">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-pm-text-secondary mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"/>
                    </div>
                </form>
                 <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end">
                    <button className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold">Update Password</button>
                </footer>
            </div>
            
             {/* Two-Factor Authentication */}
            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <div className="p-6 flex items-center justify-between">
                     <div>
                        <h2 className="font-semibold text-lg">Two-Factor Authentication (2FA)</h2>
                        <p className="text-sm text-pm-text-secondary">Add an extra layer of security to your account.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-pm-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pm-green"></div>
                    </label>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <header className="p-6 border-b border-pm-border">
                    <h2 className="font-semibold text-lg">Active Sessions</h2>
                    <p className="text-sm text-pm-text-secondary">This is a list of devices that have logged into your account.</p>
                </header>
                <ul className="divide-y divide-pm-border">
                    {activeSessions.map(session => (
                         <li key={session.id} className="p-6 flex items-center justify-between">
                            <div>
                                <p className="font-medium">{session.browser} {session.isCurrent && <span className="text-xs text-pm-green ml-2">(Current)</span>}</p>
                                <p className="text-sm text-pm-text-secondary">{session.ip} • Last seen {session.lastSeen}</p>
                            </div>
                            {!session.isCurrent && (
                                 <button className="text-sm text-pm-red hover:underline">Revoke</button>
                            )}
                         </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SecurityTab;