
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { Project, Version, Issue } from '../../types';
// FIX: Changed import to be relative
import { PlusIcon, ChevronDownIcon, DocumentTextIcon } from '../Icons';
import CreateReleaseModal from './CreateReleaseModal';
import ReleaseNotesModal from './ReleaseNotesModal';

interface ReleasesProps {
    project: Project;
    setProject: React.Dispatch<React.SetStateAction<Project>>;
}

const VersionCard: React.FC<{
    version: Version,
    issues: Issue[],
    onViewNotes: (v: Version) => void
}> = ({ version, issues, onViewNotes }) => {
    const totalIssues = issues.length;
    const doneIssues = issues.filter(i => i.status === 'Done').length;
    const progress = totalIssues > 0 ? (doneIssues / totalIssues) * 100 : 0;

    return (
        <div className="bg-pm-dark-secondary rounded-lg border border-pm-border p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">{version.name}</h3>
                    <p className="text-sm text-pm-text-secondary">{version.status.charAt(0).toUpperCase() + version.status.slice(1)}</p>
                    {version.releaseDate && <p className="text-xs text-pm-text-secondary mt-1">Due: {new Date(version.releaseDate).toLocaleDateString()}</p>}
                </div>
                <div className="relative">
                    <button className="p-1.5 rounded-md hover:bg-pm-border"><ChevronDownIcon className="w-5 h-5"/></button>
                    {/* Dropdown menu would go here */}
                </div>
            </div>
            <p className="text-sm my-3">{version.description}</p>
            <div>
                <div className="flex justify-between text-xs text-pm-text-secondary mb-1">
                    <span>Progress</span>
                    <span>{doneIssues} of {totalIssues} issues</span>
                </div>
                <div className="w-full bg-pm-border rounded-full h-2">
                    <div className="bg-pm-green h-2 rounded-full" style={{width: `${progress}%`}}></div>
                </div>
            </div>
            <div className="mt-4 flex space-x-2">
                <button 
                    onClick={() => onViewNotes(version)}
                    className="flex items-center space-x-1 text-sm text-pm-blue hover:underline"
                >
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>Release notes</span>
                </button>
                {/* Other actions */}
            </div>
        </div>
    );
}

const Releases: React.FC<ReleasesProps> = ({ project, setProject }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewingNotesFor, setViewingNotesFor] = useState<Version | null>(null);

    const handleCreateRelease = (newVersionData: Omit<Version, 'id' | 'issueIds' | 'status'>) => {
        const newVersion: Version = {
            ...newVersionData,
            id: `v-${Date.now()}`,
            issueIds: [],
            status: 'unreleased'
        };
        setProject(p => ({
            ...p,
            versions: [newVersion, ...p.versions]
        }));
    };
    
    const unreleased = project.versions.filter(v => v.status === 'unreleased');
    const released = project.versions.filter(v => v.status === 'released');

    return (<>
        <main className="flex-1 p-4 md:p-6 bg-pm-dark text-pm-text overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Releases</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-2 bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    <span>Create release</span>
                </button>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Unreleased</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unreleased.map(v => (
                            <VersionCard 
                                key={v.id} 
                                version={v} 
                                issues={project.issues.filter(i => v.issueIds.includes(i.id))}
                                onViewNotes={setViewingNotesFor}
                            />
                        ))}
                    </div>
                     {unreleased.length === 0 && <p className="text-pm-text-secondary">No unreleased versions.</p>}
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-4">Released</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {released.map(v => (
                            <VersionCard 
                                key={v.id} 
                                version={v}
                                issues={project.issues.filter(i => v.issueIds.includes(i.id))}
                                onViewNotes={setViewingNotesFor}
                            />
                        ))}
                    </div>
                     {released.length === 0 && <p className="text-pm-text-secondary">No released versions yet.</p>}
                </div>
            </div>
        </main>
        {isCreateModalOpen && <CreateReleaseModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateRelease} />}
        {viewingNotesFor && <ReleaseNotesModal version={viewingNotesFor} issues={project.issues.filter(i => viewingNotesFor.issueIds.includes(i.id))} onClose={() => setViewingNotesFor(null)} />}
    </>);
};

export default Releases;
