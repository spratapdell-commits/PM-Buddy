
import React from 'react';
import { User, Issue } from '../../../types';
import { USERS } from '../../../constants';

interface TeamWorkloadWidgetProps {
    issues: Issue[];
}

const TeamWorkloadWidget: React.FC<TeamWorkloadWidgetProps> = ({ issues }) => {
    const workload = USERS.map(user => {
        const assignedIssues = issues.filter(
            i => i.status !== 'Done' && i.assignees.some(a => a.id === user.id)
        );
        const storyPoints = assignedIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
        return { user, count: assignedIssues.length, storyPoints };
    }).sort((a,b) => b.count - a.count);

    return (
        <div className="h-full overflow-y-auto">
            <div className="space-y-2">
                {workload.map(({ user, count, storyPoints }) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-md">
                        <div className="flex items-center space-x-2">
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-pm-text-secondary">{user.role}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-semibold">{count} issues</p>
                             <p className="text-xs text-pm-text-secondary">{storyPoints} points</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamWorkloadWidget;
