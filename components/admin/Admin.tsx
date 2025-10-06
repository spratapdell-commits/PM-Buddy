
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import Members from './Members';
import Roles from './Roles';
import SSO from './SSO';
import AuditLogs from './AuditLogs';
import Automation from './Automation';
import Workflows from './Workflows';
import Profile from './Profile';
// FIX: Changed import to be relative
import { User, Project, AuditLog, AutomationRule, RuleRun } from '../../types';

interface AdminProps {
    currentUser: User;
    onUserUpdate: (user: User) => void;
    project: Project;
    auditLogs: AuditLog[];
    automationRules: AutomationRule[];
    setAutomationRules: React.Dispatch<React.SetStateAction<AutomationRule[]>>;
    ruleRuns: RuleRun[];
    logAction: (actor: User, action: string, details: Record<string, any>) => void;
    onNavigateBack: () => void;
}

type AdminView = 'profile' | 'members' | 'roles' | 'sso' | 'audit' | 'automation' | 'workflows';

const Admin: React.FC<AdminProps> = (props) => {
    const [view, setView] = useState<AdminView>('profile');

    const renderView = () => {
        switch (view) {
            case 'profile':
                return <Profile currentUser={props.currentUser} onUserUpdate={props.onUserUpdate} />;
            case 'members':
                return <Members currentUser={props.currentUser} logAction={props.logAction} />;
            case 'roles':
                return <Roles />;
            case 'sso':
                return <SSO />;
            case 'audit':
                return <AuditLogs logs={props.auditLogs} />;
            case 'automation':
                return <Automation rules={props.automationRules} setRules={props.setAutomationRules} runs={props.ruleRuns} project={props.project} />;
            case 'workflows':
                return <Workflows />;
            default:
                return <Profile currentUser={props.currentUser} onUserUpdate={props.onUserUpdate} />;
        }
    };
    
    return (
        <AdminLayout
            currentView={view}
            onNavigate={setView}
            onNavigateBack={props.onNavigateBack}
        >
            {renderView()}
        </AdminLayout>
    );
};

export default Admin;
