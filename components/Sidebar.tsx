import React, { useState } from 'react';
// FIX: Added AppView to imports
import { Project, AppView, User } from '../types';
import { BoardIcon, BacklogIcon, ReleaseIcon, ReportsIcon, DashboardIcon, SettingsIcon, PlayCircleIcon, ChevronUpDownIcon, CheckIcon, EllipsisHorizontalIcon } from './Icons';

interface SidebarProps {
    projects: Project[];
    currentProject: Project;
    currentView: AppView;
    currentUser: User;
    onNavigate: (view: AppView) => void;
    onProjectChange: (projectId: string) => void;
    onOpenCreateProjectModal: () => void;
    onOpenEditProjectModal: (project: Project) => void;
    onOpenDeleteProjectModal: (project: Project) => void;
}

const navItems = [
    { id: 'board', label: 'Kanban Board', icon: <BoardIcon className="w-5 h-5" /> },
    { id: 'active_sprint', label: 'Active Sprint', icon: <PlayCircleIcon className="w-5 h-5" /> },
    { id: 'backlog', label: 'Backlog', icon: <BacklogIcon className="w-5 h-5" /> },
    { id: 'releases', label: 'Releases', icon: <ReleaseIcon className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon className="w-5 h-5" /> },
    { id: 'dashboards', label: 'Dashboards', icon: <DashboardIcon className="w-5 h-5" /> },
];

const Sidebar: React.FC<SidebarProps> = ({ projects, currentProject, currentView, currentUser, onNavigate, onProjectChange, onOpenCreateProjectModal, onOpenEditProjectModal, onOpenDeleteProjectModal }) => {
    const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    
    const activeSprint = currentProject.sprints.find(s => s.status === 'active');
    
    return (
        <aside className="w-64 bg-pm-dark-secondary flex-shrink-0 flex flex-col border-r border-pm-border">
            {/* Project Switcher */}
            <div className="p-4 border-b border-pm-border relative">
                <button
                    onClick={() => setIsProjectSwitcherOpen(!isProjectSwitcherOpen)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-pm-border"
                >
                    <div className="flex items-center space-x-2">
                        <img src={currentProject.avatarUrl} alt={currentProject.name} className="w-8 h-8 rounded-md" />
                        <div>
                            <p className="text-sm font-semibold text-left">{currentProject.name}</p>
                            <p className="text-xs text-pm-text-secondary text-left">Software Project</p>
                        </div>
                    </div>
                    <ChevronUpDownIcon className="w-5 h-5 text-pm-text-secondary" />
                </button>
                {isProjectSwitcherOpen && (
                    <div onMouseLeave={() => { setIsProjectSwitcherOpen(false); setOpenMenu(null); }} className="absolute top-full left-4 right-4 mt-1 bg-pm-dark border border-pm-border rounded-md shadow-lg z-20">
                        <ul className="py-1">
                            {projects.map(project => (
                                <li key={project.id}>
                                    <div className="flex items-center justify-between px-3 py-2 text-sm hover:bg-pm-border group">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onProjectChange(project.id); setIsProjectSwitcherOpen(false); }}
                                           className="flex items-center space-x-2 flex-grow">
                                            <img src={project.avatarUrl} alt={project.name} className="w-6 h-6 rounded" />
                                            <span>{project.name}</span>
                                        </a>
                                        <div className="flex items-center">
                                            {project.id === currentProject.id && <CheckIcon className="w-4 h-4 text-pm-blue flex-shrink-0" />}
                                            {currentUser.role === 'Admin' && (
                                                <div className="relative flex-shrink-0 ml-2">
                                                    <button onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-pm-dark">
                                                        <EllipsisHorizontalIcon className="w-4 h-4 text-pm-text-secondary" />
                                                    </button>
                                                    {openMenu === project.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-32 bg-pm-dark border border-pm-border rounded-md shadow-lg z-30">
                                                            <ul>
                                                                <li><button onClick={() => { onOpenEditProjectModal(project); setOpenMenu(null); setIsProjectSwitcherOpen(false); }} className="w-full text-left block px-3 py-1.5 text-xs hover:bg-pm-border">Edit</button></li>
                                                                <li><button onClick={() => { onOpenDeleteProjectModal(project); setOpenMenu(null); setIsProjectSwitcherOpen(false); }} className="w-full text-left block px-3 py-1.5 text-xs text-pm-red hover:bg-pm-border">Delete</button></li>
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                             <li className="border-t border-pm-border my-1"></li>
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onOpenCreateProjectModal(); setIsProjectSwitcherOpen(false); }}
                                   className="block px-3 py-2 text-sm hover:bg-pm-border">
                                    + Create new project
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => {
                    if(item.id === 'active_sprint' && !activeSprint) return null;
                    return (
                        <a
                            key={item.id}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(item.id as AppView);
                            }}
                            className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md ${currentView === item.id ? 'bg-pm-blue/20 text-pm-blue font-semibold' : 'text-pm-text-secondary hover:bg-pm-border hover:text-pm-text'}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </a>
                    )
                })}
            </nav>

            {/* Settings */}
            <div className="p-4 border-t border-pm-border">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate('admin');
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md ${currentView === 'admin' ? 'bg-pm-blue/20 text-pm-blue font-semibold' : 'text-pm-text-secondary hover:bg-pm-border hover:text-pm-text'}`}
                >
                    <SettingsIcon className="w-5 h-5" />
                    <span>Project Settings</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;