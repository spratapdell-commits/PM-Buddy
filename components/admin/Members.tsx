
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { User, Role } from '../../types';
// FIX: Changed import to be relative
import { USERS } from '../../constants';
// FIX: Changed import to be relative
import { PencilIcon, TrashIcon } from '../Icons';

interface MembersProps {
    currentUser: User;
    logAction: (actor: User, action: string, details: Record<string, any>) => void;
}

const Members: React.FC<MembersProps> = ({ currentUser, logAction }) => {
    const [members, setMembers] = useState<User[]>(USERS);

    const handleRoleChange = (userId: string, newRole: Role) => {
        const oldUser = members.find(m => m.id === userId);
        if (oldUser && oldUser.role !== newRole) {
            setMembers(members.map(member => member.id === userId ? { ...member, role: newRole } : member));
            logAction(currentUser, 'user.role.update', {
                targetUserId: userId,
                targetUserName: oldUser.name,
                oldRole: oldUser.role,
                newRole: newRole,
            });
        }
    };
    
    // In a real app, invite would trigger a backend process.
    const handleInvite = () => {
        const email = 'new.user@example.com';
        const role = 'Member';
        logAction(currentUser, 'user.invite', { email, role });
        // Here you would typically show a confirmation message.
        alert(`Invite sent to ${email} with role ${role}. (This is a simulation)`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members</h1>
                <button 
                  onClick={handleInvite}
                  className="bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors"
                >
                    Invite Member
                </button>
            </div>
            
            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-pm-text-secondary uppercase border-b border-pm-border">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="border-b border-pm-border last:border-b-0">
                                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={member.avatarUrl} alt={member.name} />
                                        <div>
                                            <div>{member.name}</div>
                                            <div className="text-xs text-pm-text-secondary">{member.email}</div>
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value as Role)}
                                        disabled={member.id === currentUser.id}
                                        className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-pm-blue disabled:opacity-50"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Member">Member</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-2 text-pm-text-secondary hover:text-pm-blue"><PencilIcon className="w-4 h-4" /></button>
                                        <button disabled={member.id === currentUser.id} className="p-2 text-pm-text-secondary hover:text-pm-red disabled:opacity-50 disabled:hover:text-pm-text-secondary"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Members;
