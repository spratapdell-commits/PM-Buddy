import React from 'react';
import { Project, User, Issue } from '../../types';
import { PlayCircleIcon } from '../Icons';

interface MobileHomeProps {
    project: Project;
    currentUser: User;
}

const MobileHome: React.FC<MobileHomeProps> = ({ project, currentUser }) => {
    const myIssues = project.issues.filter(issue => issue.assignees.some(a => a.id === currentUser.id) && issue.status !== 'Done');
    const activeSprint = project.sprints.find(s => s.status === 'active');
    const sprintIssues = activeSprint ? project.issues.filter(i => activeSprint.issueIds.includes(i.id)) : [];
    const completedPoints = sprintIssues.filter(i => i.status === 'Done').reduce((acc, i) => acc + (i.storyPoints || 0), 0);
    const totalPoints = sprintIssues.reduce((acc, i) => acc + (i.storyPoints || 0), 0);

    return (
        <div className="p-4 space-y-6">
            <div>
                <h1 className="text-xl font-bold">Home</h1>
                <p className="text-pm-text-secondary">Welcome back, {currentUser.name.split(' ')[0]}!</p>
            </div>

            {/* My Work */}
            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border p-4">
                <h2 className="font-semibold mb-3">My Work ({myIssues.length})</h2>
                <div className="space-y-2">
                    {myIssues.length > 0 ? myIssues.slice(0, 5).map(issue => (
                        <IssueRow key={issue.id} issue={issue} />
                    )) : (
                        <p className="text-sm text-pm-text-secondary">You have no pending issues. Great job!</p>
                    )}
                </div>
            </div>
            
            {/* Active Sprint */}
            {activeSprint && (
                 <div className="bg-pm-dark-secondary rounded-lg border border-pm-border p-4">
                    <div className="flex items-center space-x-2 mb-3">
                        <PlayCircleIcon className="w-5 h-5 text-pm-green" />
                        <h2 className="font-semibold">{activeSprint.name}</h2>
                    </div>
                    <p className="text-sm text-pm-text-secondary mb-3">{activeSprint.goal}</p>
                    <div>
                        <div className="flex justify-between text-xs text-pm-text-secondary mb-1">
                            <span>Progress</span>
                            <span>{completedPoints} / {totalPoints} SP</span>
                        </div>
                        <div className="w-full bg-pm-border rounded-full h-2">
                            <div className="bg-pm-green h-2 rounded-full" style={{width: `${totalPoints > 0 ? (completedPoints/totalPoints)*100 : 0}%`}}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const IssueRow: React.FC<{issue: Issue}> = ({ issue }) => (
    <div className="bg-pm-dark rounded-md p-2 border border-pm-border/50">
        <p className="text-sm truncate">{issue.summary}</p>
        <span className="text-xs text-pm-text-secondary">{issue.key} • {issue.status}</span>
    </div>
);

export default MobileHome;