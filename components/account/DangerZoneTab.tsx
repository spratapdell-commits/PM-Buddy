
import React, { useState } from 'react';
import { XMarkIcon } from '../Icons';

interface DangerZoneTabProps {
    onLogout: () => void;
}

const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ onLogout }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = () => {
        // In a real app, this would call DELETE /api/account/delete
        alert("Account deleted. Logging out.");
        setIsDeleteModalOpen(false);
        onLogout();
    };

    return (<>
        <div className="max-w-3xl space-y-8">
             <div>
                <h1 className="text-xl font-bold mb-1">Danger Zone</h1>
                <p className="text-pm-text-secondary mb-6">Be careful, these actions are not easily reversible.</p>
            </div>

            {/* Deactivate Account */}
            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                 <div className="p-6 flex items-start justify-between">
                     <div>
                        <h2 className="font-semibold text-lg">Deactivate Account</h2>
                        <p className="text-sm text-pm-text-secondary max-w-md">Your account will be disabled and you will be logged out. You can reactivate it by signing in again.</p>
                    </div>
                    <button className="px-3 py-1.5 text-sm rounded-md border border-pm-orange text-pm-orange hover:bg-pm-orange/10 flex-shrink-0">
                        Deactivate
                    </button>
                </div>
            </div>

            {/* Delete Account */}
             <div className="bg-pm-dark-secondary rounded-lg border border-pm-red">
                 <div className="p-6 flex items-start justify-between">
                     <div>
                        <h2 className="font-semibold text-lg text-pm-red">Delete Account Permanently</h2>
                        <p className="text-sm text-pm-text-secondary max-w-md">All of your data, including projects, issues, and comments, will be permanently removed. This action cannot be undone.</p>
                    </div>
                    <button onClick={() => setIsDeleteModalOpen(true)} className="px-3 py-1.5 text-sm rounded-md bg-pm-red text-white hover:bg-pm-red/90 flex-shrink-0">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
        
        {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border">
                    <header className="flex items-center justify-between p-4 border-b border-pm-border">
                        <h2 className="text-lg font-semibold text-pm-red">Confirm Permanent Deletion</h2>
                         <button onClick={() => setIsDeleteModalOpen(false)} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                    </header>
                    <div className="p-6 space-y-4">
                        <p>This action is irreversible. Please type <strong className="text-pm-red">DELETE</strong> to confirm.</p>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                     <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end">
                        <button 
                            onClick={handleDelete}
                            disabled={confirmText !== 'DELETE'}
                            className="px-4 py-2 text-sm rounded-md bg-pm-red text-white font-semibold disabled:bg-pm-red/50"
                        >
                            Delete My Account
                        </button>
                    </footer>
                </div>
            </div>
        )}
    </>);
};

export default DangerZoneTab;