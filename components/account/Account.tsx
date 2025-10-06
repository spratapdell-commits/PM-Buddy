
import React, { useState } from 'react';
import AccountLayout from './AccountLayout';
import ProfileTab from './ProfileTab';
import LinkedAccountsTab from './LinkedAccountsTab';
import SecurityTab from './SecurityTab';
import PreferencesTab from './PreferencesTab';
import DangerZoneTab from './DangerZoneTab';
import { User } from '../../types';

interface AccountProps {
    currentUser: User;
    onUserUpdate: (user: User) => void;
    onLogout: () => void;
    onNavigateBack: () => void;
}

export type AccountView = 'profile' | 'linked' | 'security' | 'preferences' | 'danger';

const Account: React.FC<AccountProps> = (props) => {
    const [view, setView] = useState<AccountView>('profile');

    const renderView = () => {
        switch (view) {
            case 'profile':
                return <ProfileTab currentUser={props.currentUser} onUserUpdate={props.onUserUpdate} />;
            case 'linked':
                return <LinkedAccountsTab currentUser={props.currentUser} onUserUpdate={props.onUserUpdate} />;
            case 'security':
                return <SecurityTab />;
            case 'preferences':
                 return <PreferencesTab currentUser={props.currentUser} onUserUpdate={props.onUserUpdate} />;
            case 'danger':
                 return <DangerZoneTab onLogout={props.onLogout} />;
            default:
                return <ProfileTab currentUser={props.currentUser} onUserUpdate={props.onUserUpdate} />;
        }
    };
    
    return (
        <main className="flex-1 p-4 md:p-6 bg-pm-dark text-pm-text">
            <AccountLayout
                currentView={view}
                onNavigate={setView}
                onNavigateBack={props.onNavigateBack}
            >
                {renderView()}
            </AccountLayout>
        </main>
    );
};

export default Account;