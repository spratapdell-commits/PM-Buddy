import React, { useState, useEffect, useCallback } from 'react';
// FIX: Added AppView to imports
import { AppView, User, Project, Notification, AuditLog, AutomationRule, RuleRun, QueuedAction } from './types';
import { MOCK_PROJECTS, USERS, MOCK_NOTIFICATIONS, MOCK_AUDIT_LOGS, MOCK_AUTOMATION_RULES, MOCK_RULE_RUNS } from './constants';
import * as api from './api';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import Admin from './components/admin/Admin';
import Login from './components/Login';
import GlobalStyles from './components/GlobalStyles';
import SprintPlanning from './components/sprint/SprintPlanning';
import ActiveSprintBoard from './components/sprint/ActiveSprintBoard';
import Releases from './components/releases/Releases';
import Reports from './components/reports/Reports';
import DashboardView from './components/dashboards/DashboardView';
import Account from './components/account/Account';
import MobileLayout from './components/mobile/MobileLayout';
import CreateProjectModal from './components/project/CreateProjectModal';
import EditProjectModal from './components/project/EditProjectModal';
import DeleteProjectModal from './components/project/DeleteProjectModal';


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
    const [currentProjectId, setCurrentProjectId] = useState<string>(MOCK_PROJECTS[0].id);
    const [currentView, setCurrentView] = useState<AppView>('board');
    
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
    const [automationRules, setAutomationRules] = useState<AutomationRule[]>(MOCK_AUTOMATION_RULES);
    const [ruleRuns, setRuleRuns] = useState<RuleRun[]>(MOCK_RULE_RUNS);

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    // Simulate fetching current user
    useEffect(() => {
        api.fetchMe().then(user => {
            // setCurrentUser(user); // Keep it null initially to show login
        });
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleUserUpdate = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        // Also update the user in the global user list (for demo purposes)
        // In a real app, this would be a separate API call.
    };
    
    const currentProject = projects.find(p => p.id === currentProjectId);

    const setProject = useCallback((updatedProject: Project) => {
        setProjects(prevProjects => prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
    }, []);

    const logAction = useCallback((actor: User, action: string, details: Record<string, any>) => {
        const newLog: AuditLog = {
            id: `al-${Date.now()}`,
            actor,
            action,
            details,
            timestamp: new Date().toISOString()
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }, []);

    const addNotification = useCallback((message: string) => {
        const newNotification: Notification = {
            id: `n-${Date.now()}`,
            message,
            timestamp: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);
    
    const handleCreateProject = (newProject: Project) => {
        setProjects(prev => [...prev, newProject]);
        setCurrentProjectId(newProject.id);
        setIsCreateProjectModalOpen(false);
        addNotification(`Project "${newProject.name}" created successfully!`);
    };

    const handleUpdateProject = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setEditingProject(null);
        addNotification(`Project "${updatedProject.name}" updated.`);
    };

    const handleDeleteProject = () => {
        if (!deletingProject) return;

        if (projects.length <= 1) {
            alert("Cannot delete the last remaining project.");
            setDeletingProject(null);
            return;
        }

        const projectName = deletingProject.name;
        const newProjects = projects.filter(p => p.id !== deletingProject.id);
        setProjects(newProjects);

        if (currentProjectId === deletingProject.id) {
            setCurrentProjectId(newProjects[0].id);
        }
        
        setDeletingProject(null);
        addNotification(`Project "${projectName}" was deleted.`);
    };


    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    if (!currentProject) {
        return <div className="p-8 text-center text-pm-text">Please select a project or create a new one to begin.</div>;
    }
    
    if (isMobileView) {
        return <MobileLayout 
                    project={currentProject} 
                    currentUser={currentUser} 
                    queuedActions={queuedActions}
                    setQueuedActions={setQueuedActions}
                    onExitMobileView={() => setIsMobileView(false)} 
                />
    }

    const renderMainView = () => {
        switch (currentView) {
            case 'board':
                return <Board project={currentProject} setProject={setProject} currentUser={currentUser} logAction={logAction} addNotification={addNotification} />;
            case 'admin':
                return <Admin
                            currentUser={currentUser}
                            onUserUpdate={handleUserUpdate}
                            project={currentProject}
                            auditLogs={auditLogs}
                            automationRules={automationRules}
                            setAutomationRules={setAutomationRules}
                            ruleRuns={ruleRuns}
                            logAction={logAction}
                            onNavigateBack={() => setCurrentView('board')}
                        />;
            case 'backlog':
                return <main className="flex-1 flex flex-col overflow-auto p-4 md:p-6 bg-pm-dark text-pm-text">
                            <SprintPlanning project={currentProject} setProject={setProject} currentUser={currentUser} />
                       </main>;
            case 'active_sprint':
                const activeSprint = currentProject.sprints.find(s => s.status === 'active');
                if (!activeSprint) return <main className="flex-1 p-6 text-center">No active sprint.</main>;
                return <ActiveSprintBoard 
                            project={currentProject} 
                            setProject={setProject} 
                            activeSprint={activeSprint}
                            currentUser={currentUser} 
                            logAction={logAction} 
                            addNotification={addNotification}
                            onCompleteSprint={() => alert('Sprint completion logic not implemented.')} 
                        />;
            case 'releases':
                return <Releases project={currentProject} setProject={setProject} />;
            case 'reports':
                return <main className="flex-1 p-4 md:p-6 bg-pm-dark text-pm-text overflow-y-auto">
                           <Reports project={currentProject} />
                       </main>;
            case 'dashboards':
                 return <main className="flex-1 p-4 md:p-6 bg-pm-dark text-pm-text overflow-y-auto">
                           <DashboardView project={currentProject} currentUser={currentUser} />
                        </main>;
            case 'account':
                return <Account 
                            currentUser={currentUser}
                            onUserUpdate={handleUserUpdate}
                            onLogout={handleLogout}
                            onNavigateBack={() => setCurrentView('board')}
                        />
            default:
                return <main className="flex-1 p-6">View not implemented: {currentView}</main>;
        }
    };

    return (
        <>
            <GlobalStyles />
            <div className="h-screen w-screen bg-pm-dark flex text-pm-text font-sans">
                <Sidebar
                    projects={projects}
                    currentProject={currentProject}
                    currentView={currentView}
                    currentUser={currentUser}
                    onNavigate={setCurrentView}
                    onProjectChange={setCurrentProjectId}
                    onOpenCreateProjectModal={() => setIsCreateProjectModalOpen(true)}
                    onOpenEditProjectModal={setEditingProject}
                    onOpenDeleteProjectModal={setDeletingProject}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header
                        currentUser={currentUser}
                        notifications={notifications}
                        onNavigate={(view) => setCurrentView(view as AppView)}
                        onLogout={handleLogout}
                    />
                     {currentView !== 'board' && currentView !== 'active_sprint' && currentView !== 'admin' && currentView !== 'account' ? (
                       renderMainView()
                     ) : (
                        <main className="flex-1 flex flex-col overflow-hidden p-4 md:p-6 bg-pm-dark">
                          {renderMainView()}
                        </main>
                     )}
                </div>
            </div>

            {isCreateProjectModalOpen && <CreateProjectModal onClose={() => setIsCreateProjectModalOpen(false)} onCreate={handleCreateProject} />}
            {editingProject && <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onSave={handleUpdateProject} />}
            {deletingProject && <DeleteProjectModal project={deletingProject} onClose={() => setDeletingProject(null)} onConfirm={handleDeleteProject} />}
        </>
    );
};

export default App;