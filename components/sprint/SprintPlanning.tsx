
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { Project, Sprint, Issue, User } from '../../types';
import CreateIssueModal from './CreateIssueModal';
import BacklogIssueRow from './BacklogIssueRow';
import BulkActionBar from './BulkActionBar';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';

interface SprintPlanningProps {
    project: Project;
    setProject: React.Dispatch<React.SetStateAction<Project>>;
    currentUser: User;
}

const SprintContainer: React.FC<{ sprint: Sprint, issues: Issue[], children: React.ReactNode }> = ({ sprint, issues, children }) => {
    const { setNodeRef, isOver } = useDroppable({ id: sprint.id });
    const storyPoints = issues.reduce((sum, issue) => sum + (issue.storyPoints || 0), 0);

    return (
        <div ref={setNodeRef} className={`bg-pm-dark-secondary rounded-lg border ${isOver ? 'border-pm-blue' : 'border-pm-border'} flex-1 flex flex-col`}>
            <div className="p-4 border-b border-pm-border">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{sprint.name}</h3>
                    <span className="text-sm text-pm-text-secondary">{storyPoints} Story Points</span>
                </div>
                <p className="text-sm text-pm-text-secondary mt-1">{sprint.goal || 'Plan your sprint by dragging issues here.'}</p>
            </div>
            <div className="p-2 space-y-1 h-full overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const SprintPlanning: React.FC<SprintPlanningProps> = ({ project, setProject, currentUser }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedIssueIds, setSelectedIssueIds] = useState<Set<string>>(new Set());
    
    const plannedSprint = project.sprints.find(s => s.status === 'planned');
    if (!plannedSprint) {
        // In a real app, you'd handle creating new sprints.
        return <div className="p-6">Error: No planned sprint found. Please create one in the project settings.</div>;
    }

    const backlogIssues = project.issues.filter(i => !i.sprintId);
    const sprintIssues = project.issues.filter(i => i.sprintId === plannedSprint.id);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const issueId = active.id as string;
            const targetSprintId = over.id === 'backlog' ? undefined : over.id as string;

            setProject(p => ({
                ...p,
                issues: p.issues.map(i => i.id === issueId ? { ...i, sprintId: targetSprintId } : i),
            }));
        }
    };
    
    const handleSaveNewIssue = (issue: Issue) => {
        setProject(p => ({ ...p, issues: [issue, ...p.issues] }));
    };

    const toggleSelection = (issueId: string) => {
        setSelectedIssueIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(issueId)) {
                newSet.delete(issueId);
            } else {
                newSet.add(issueId);
            }
            return newSet;
        });
    };
    
    const { setNodeRef: setBacklogRef, isOver: isOverBacklog } = useDroppable({ id: 'backlog' });


    return (<>
        
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold">Backlog</h1>
                <p className="text-pm-text-secondary">Plan your upcoming sprints.</p>
            </div>
            <div className="flex space-x-2">
                <button disabled={sprintIssues.length === 0} className="bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold disabled:bg-pm-blue/50">
                    Start Sprint
                </button>
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-pm-dark-secondary border border-pm-border px-4 py-2 rounded-md text-sm font-semibold">
                    Create Issue
                </button>
            </div>
        </div>
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Backlog */}
                <div ref={setBacklogRef} className={`bg-pm-dark-secondary rounded-lg border ${isOverBacklog ? 'border-pm-blue' : 'border-pm-border'} flex-1 flex flex-col`}>
                    <div className="p-4 border-b border-pm-border flex-shrink-0">
                        <h3 className="font-semibold">Backlog ({backlogIssues.length})</h3>
                    </div>
                    <div className="p-2 space-y-1 overflow-y-auto">
                        {backlogIssues.map(issue => (
                            <BacklogIssueRow 
                                key={issue.id} 
                                issue={issue} 
                                isSelected={selectedIssueIds.has(issue.id)}
                                onToggleSelect={toggleSelection}
                            />
                        ))}
                    </div>
                </div>
                {/* Sprint */}
                    <SprintContainer sprint={plannedSprint} issues={sprintIssues}>
                    {sprintIssues.map(issue => (
                        <BacklogIssueRow 
                            key={issue.id} 
                            issue={issue} 
                            isSelected={selectedIssueIds.has(issue.id)}
                            onToggleSelect={toggleSelection}
                        />
                    ))}
                </SprintContainer>
            </div>
        </DndContext>
        
        {isCreateModalOpen && (
            <CreateIssueModal 
                project={project} 
                currentUser={currentUser} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSave={handleSaveNewIssue}
            />
        )}
        {selectedIssueIds.size > 0 && (
            <BulkActionBar 
                selectedCount={selectedIssueIds.size} 
                project={project}
                onClear={() => setSelectedIssueIds(new Set())}
            />
        )}
    </>);
};

export default SprintPlanning;
