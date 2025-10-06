
import React from 'react';
// FIX: Changed import to be relative
import { ROLE_PERMISSIONS } from '../../constants';
// FIX: Changed import to be relative
import { Permission } from '../../types';

const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
    'project:settings': 'Can view and edit project settings.',
    'user:manage': 'Can invite, remove, and change the roles of members.',
    'user:read': 'Can view the list of members in the organization.',
    'issue:create': 'Can create new issues, tasks, and bugs.',
    'issue:edit': 'Can edit existing issues.',
    'issue:delete': 'Can delete issues.',
    'billing:manage': 'Can view and manage billing information and subscriptions.',
};

const Roles: React.FC = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Roles & Permissions</h1>
                <button className="bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors">
                    Create Role
                </button>
            </div>

            <div className="space-y-6">
                {ROLE_PERMISSIONS.map(role => (
                    <div key={role.name} className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                        <div className="p-4 border-b border-pm-border">
                            <h2 className="text-lg font-semibold">{role.name}</h2>
                            <p className="text-sm text-pm-text-secondary">Users with this role can perform the following actions.</p>
                        </div>
                        <div className="p-4">
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.keys(PERMISSION_DESCRIPTIONS).map(p => {
                                    const perm = p as Permission;
                                    const hasPermission = role.permissions.includes(perm);
                                    return (
                                        <li key={perm} className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <input
                                                    type="checkbox"
                                                    checked={hasPermission}
                                                    readOnly
                                                    className={`w-4 h-4 rounded text-pm-blue bg-pm-dark border-pm-border focus:ring-pm-blue ${hasPermission ? '' : 'opacity-50'}`}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{perm}</p>
                                                <p className="text-xs text-pm-text-secondary">{PERMISSION_DESCRIPTIONS[perm]}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Roles;
