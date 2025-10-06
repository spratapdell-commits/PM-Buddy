// FIX: Create constants file with mock data, which was previously a placeholder.
import { Project, User, Role, IssueType, IssuePriority, AuditLog, AutomationRule, RuleRun, Notification, DailySnapshot, RolePermission, TriggerType, ConditionOperator, ActionType } from './types';

export const USERS: User[] = [
  { id: 'u-1', name: 'Alex Reid', email: 'alex@example.com', avatarUrl: `https://i.pravatar.cc/150?u=u-1`, role: 'Admin', googleId: 'google-alex-123', bio: 'Lead Developer focusing on backend systems.' },
  { id: 'u-2', name: 'Casey Lee', email: 'casey@example.com', avatarUrl: `https://i.pravatar.cc/150?u=u-2`, role: 'Member', githubId: 'github-casey-456', bio: 'Frontend developer and UI/UX enthusiast.' },
  { id: 'u-3', name: 'Jordan Patel', email: 'jordan@example.com', avatarUrl: `https://i.pravatar.cc/150?u=u-3`, role: 'Member', bio: 'QA Engineer and automation specialist.' },
  { id: 'u-4', name: 'Morgan Taylor', email: 'morgan@example.com', avatarUrl: `https://i.pravatar.cc/150?u=u-4`, role: 'Viewer', bio: 'Product Manager.' },
];

export const MOCK_PROJECT_PHOENIX: Project = {
  id: 'p-1',
  name: 'Phoenix Project',
  key: 'PHX',
  avatarUrl: 'https://i.pravatar.cc/150?u=p-1',
  columns: [
    { id: 'col-1', title: 'To Do', issueIds: ['i-1', 'i-2'] },
    { id: 'col-2', title: 'In Progress', issueIds: ['i-3', 'i-4'], wipLimit: 3 },
    { id: 'col-3', title: 'In Review', issueIds: ['i-5'], wipLimit: 2 },
    { id: 'col-4', title: 'Done', issueIds: ['i-6'] },
  ],
  issues: [
    { id: 'i-1', key: 'PHX-1', summary: 'Set up CI/CD pipeline', description: 'Automate build and deployment process.', type: IssueType.STORY, priority: IssuePriority.HIGH, status: 'To Do', assignees: [USERS[0]], reporterId: 'u-2', labels: ['devops'], storyPoints: 8, comments: [], attachments: [], history: [], rank: 'a' },
    { id: 'i-2', key: 'PHX-2', summary: 'Design login page UI', description: 'Create mockups and final designs for the user login flow.', type: IssueType.TASK, priority: IssuePriority.MEDIUM, status: 'To Do', assignees: [USERS[1]], reporterId: 'u-4', labels: ['ui', 'design'], storyPoints: 5, comments: [], attachments: [], history: [], rank: 'b' },
    { id: 'i-3', key: 'PHX-3', summary: 'Develop authentication API endpoints', description: 'Implement login, logout, and registration endpoints.', type: IssueType.STORY, priority: IssuePriority.HIGHEST, status: 'In Progress', assignees: [USERS[0]], reporterId: 'u-4', labels: ['backend', 'api'], storyPoints: 8, comments: [], attachments: [], history: [], rank: 'c' },
    { id: 'i-4', key: 'PHX-4', summary: 'Button component is misaligned on mobile', description: 'The primary call-to-action button on the homepage is off-center on screens smaller than 400px.', type: IssueType.BUG, priority: IssuePriority.HIGH, status: 'In Progress', assignees: [USERS[1]], reporterId: 'u-3', labels: ['bug', 'css'], storyPoints: 2, comments: [], attachments: [], history: [], rank: 'd', sprintId: 's-1' },
    { id: 'i-5', key: 'PHX-5', summary: 'Write unit tests for user service', description: 'Ensure 90% test coverage for the user service module.', type: IssueType.TASK, priority: IssuePriority.MEDIUM, status: 'In Review', assignees: [USERS[2]], reporterId: 'u-1', labels: ['testing'], storyPoints: 5, comments: [], attachments: [], history: [], rank: 'e', sprintId: 's-1' },
    { id: 'i-6', key: 'PHX-6', summary: 'Deploy staging environment', description: 'The staging environment was successfully deployed.', type: IssueType.TASK, priority: IssuePriority.LOW, status: 'Done', assignees: [USERS[0]], reporterId: 'u-1', labels: [], storyPoints: 3, comments: [], attachments: [], history: [], rank: 'f', sprintId: 's-1', createdAt: '2023-10-01T10:00:00Z', completedAt: '2023-10-05T15:30:00Z' },
    { id: 'i-7', key: 'PHX-7', summary: 'User cannot reset password', description: 'The "forgot password" link results in a 500 error.', type: IssueType.BUG, priority: IssuePriority.HIGHEST, status: 'Backlog', assignees: [], reporterId: 'u-3', labels: ['bug', 'critical'], storyPoints: 3, comments: [], attachments: [], history: [], rank: 'g' },
  ],
  sprints: [
      { id: 's-1', name: 'Sprint 1', goal: 'Launch MVP Authentication', status: 'active', issueIds: ['i-4', 'i-5', 'i-6'], startDate: '2023-10-01', endDate: '2023-10-14' },
      { id: 's-2', name: 'Sprint 2', goal: 'Dashboard and Reporting', status: 'planned', issueIds: [] },
  ],
  versions: [
      { id: 'v-1', name: 'v1.0.0 - Initial Release', description: 'The first public release.', status: 'released', releaseDate: '2023-09-30', issueIds: [] },
      { id: 'v-2', name: 'v1.1.0 - Bugfixes', description: 'Critical bugfixes for auth flow.', status: 'unreleased', releaseDate: '2023-10-20', issueIds: ['i-4', 'i-7'] },
  ],
  dashboards: [
      { id: 'd-1', name: 'Engineering Dashboard', widgets: [
          { id: 'w-1', type: 'my-work', title: 'My Work', x: 0, y: 0, w: 6, h: 2 },
          { id: 'w-2', type: 'sprint-burndown', title: 'Sprint Burndown', x: 6, y: 0, w: 6, h: 2 },
          { id: 'w-3', type: 'cumulative-flow', title: 'Cumulative Flow Diagram', x: 0, y: 2, w: 12, h: 2 },
      ] }
  ],
};

export const MOCK_PROJECT_MOBILE: Project = {
  id: 'p-2',
  name: 'Mobile App',
  key: 'MOB',
  avatarUrl: 'https://i.pravatar.cc/150?u=p-2',
  columns: [
    { id: 'mcol-1', title: 'Backlog', issueIds: ['mi-1'] },
    { id: 'mcol-2', title: 'In Progress', issueIds: ['mi-2'], wipLimit: 2 },
    { id: 'mcol-3', title: 'Done', issueIds: [] },
  ],
  issues: [
    { id: 'mi-1', key: 'MOB-1', summary: 'Implement push notifications', description: 'Use Firebase Cloud Messaging to set up push notifications.', type: IssueType.STORY, priority: IssuePriority.HIGH, status: 'Backlog', assignees: [USERS[1]], reporterId: 'u-4', labels: ['mobile', 'notifications'], storyPoints: 8, comments: [], attachments: [], history: [], rank: 'a' },
    { id: 'mi-2', key: 'MOB-2', summary: 'Fix crash on startup for Android 13', description: 'App crashes immediately on devices running Android 13.', type: IssueType.BUG, priority: IssuePriority.HIGHEST, status: 'In Progress', assignees: [USERS[2]], reporterId: 'u-3', labels: ['bug', 'android'], storyPoints: 5, comments: [], attachments: [], history: [], rank: 'b' },
  ],
  sprints: [],
  versions: [],
  dashboards: [],
};

export const MOCK_PROJECTS = [MOCK_PROJECT_PHOENIX, MOCK_PROJECT_MOBILE];

export const ROLE_PERMISSIONS: RolePermission[] = [
    { name: 'Admin', permissions: ['project:settings', 'user:manage', 'user:read', 'issue:create', 'issue:edit', 'issue:delete', 'billing:manage'] },
    { name: 'Member', permissions: ['user:read', 'issue:create', 'issue:edit'] },
    { name: 'Viewer', permissions: ['user:read'] },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n-1', message: 'Alex Reid assigned you PHX-2.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'n-2', message: 'Casey Lee mentioned you in a comment on PHX-3.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    { id: 'al-1', actor: USERS[0], action: 'user.role.update', details: { targetUserId: 'u-4', oldRole: 'Viewer', newRole: 'Member' }, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'al-2', actor: USERS[1], action: 'issue.create', details: { issueKey: 'PHX-2', summary: 'Design login page UI' }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: 'al-3', actor: USERS[0], action: 'project.settings.update', details: { setting: 'wipLimit', column: 'In Review', newValue: 2 }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export const MOCK_AUTOMATION_RULES: AutomationRule[] = [
    { id: 'ar-1', name: 'Auto-assign bugs to QA', description: 'When a bug is created, assign it to the QA team lead.', isEnabled: true, trigger: { type: 'issue-created' }, conditions: [{id: 'c-1', field: 'type', operator: 'is', value: IssueType.BUG}], actions: [{id: 'a-1', type: 'assign-to', value: 'u-3'}] },
    { id: 'ar-2', name: 'Close parent story', description: 'When all sub-tasks of a story are Done, move the story to Done.', isEnabled: false, trigger: { type: 'issue-updated' }, conditions: [], actions: [] },
];

export const MOCK_RULE_RUNS: RuleRun[] = [
    { id: 'rr-1', ruleId: 'ar-1', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), triggeringEvent: 'Issue PHX-4 created', status: 'success', result: 'Assigned to Jordan Patel', details: { issueKey: 'PHX-4' } },
    { id: 'rr-2', ruleId: 'ar-1', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), triggeringEvent: 'Issue PHX-7 created', status: 'failure', result: 'User not found', details: { error: 'Assignee ID u-XYZ not found in project' } },
];

export const MOCK_SNAPSHOTS: DailySnapshot[] = [
    { date: '10-01', statusCounts: { 'To Do': 5, 'In Progress': 1, 'Done': 0 } },
    { date: '10-02', statusCounts: { 'To Do': 4, 'In Progress': 2, 'Done': 0 } },
    { date: '10-03', statusCounts: { 'To Do': 4, 'In Progress': 1, 'Done': 1 } },
    { date: '10-04', statusCounts: { 'To Do': 3, 'In Progress': 2, 'Done': 1 } },
    { date: '10-05', statusCounts: { 'To Do': 2, 'In Progress': 2, 'Done': 2 } },
];