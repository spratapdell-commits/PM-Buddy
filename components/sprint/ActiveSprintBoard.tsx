
import React from 'react';
// FIX: Changed import to be relative
import { Project, Sprint } from '../../types';
import Board from '../Board'; // Re-using the main board component for UI consistency
import BurndownChart from '../charts/BurndownChart';

const ActiveSprintBoard: React.FC<{
    project: Project,
    setProject: React.Dispatch<React.SetStateAction<Project>>,
    activeSprint: Sprint,
    currentUser: any,
    logAction: any,
    onCompleteSprint: any,
    addNotification: (message: string) => void,
}> = ({ project, setProject, activeSprint, currentUser, logAction, onCompleteSprint, addNotification }) => {

    const sprintIssues = project.issues.filter(issue => issue.sprintId === activeSprint.id);
    
    // Create a project-like object filtered for the sprint
    const sprintProject = {
        ...project,
        issues: sprintIssues,
        // Filter columns to only include issues from this sprint
        columns: project.columns.map(col => ({
            ...col,
            issueIds: col.issueIds.filter(id => sprintIssues.some(issue => issue.id === id))
        }))
    };

    return (
         <main className="flex-1 flex flex-col overflow-auto p-4 md:p-6 bg-pm-dark">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{activeSprint.name}</h1>
                    <p className="text-pm-text-secondary">{activeSprint.goal}</p>
                </div>
                <button 
                    onClick={onCompleteSprint}
                    className="bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors"
                >
                    Complete Sprint
                </button>
            </div>
            <div className="mb-4">
                <BurndownChart sprint={activeSprint} issues={sprintIssues} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                 <Board 
                    project={sprintProject}
                    setProject={setProject}
                    currentUser={currentUser}
                    logAction={logAction}
                    addNotification={addNotification}
                 />
            </div>
        </main>
    );
};

export default ActiveSprintBoard;
