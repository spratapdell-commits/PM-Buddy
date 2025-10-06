export type Role = 'Admin' | 'Member' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  googleId?: string;
  githubId?: string;
  bio?: string;
  themePreference?: 'dark' | 'light' | 'auto';
  notifications?: {
    task_updates: boolean;
    weekly_digest: boolean;
  }
}

export enum IssueType {
  STORY = 'Story',
  TASK = 'Task',
  BUG = 'Bug',
}

export enum IssuePriority {
  HIGHEST = 'Highest',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  LOWEST = 'Lowest',
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface Attachment {
    id: string;
    fileName: string;
    url: string;
    mimeType: string;
    size: number;
}

export interface HistoryItem {
    id: string;
    field: string;
    oldValue: any;
    newValue: any;
    updatedBy: User;
    timestamp: string;
}

export interface Issue {
  id: string;
  key: string;
  summary: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: string; // Should match a column title
  assignees: User[];
  reporterId: string;
  labels: string[];
  storyPoints: number | null;
  comments: Comment[];
  attachments: Attachment[];
  history: HistoryItem[];
  rank: string;
  sprintId?: string;
  createdAt?: string;
  completedAt?: string;
  isBlocked?: boolean;
  blockedBy?: string[];
}

export interface ColumnData {
  id: string;
  title: string;
  issueIds: string[];
  wipLimit?: number;
}

export interface Sprint {
    id: string;
    name: string;
    goal: string;
    startDate?: string;
    endDate?: string;
    status: 'planned' | 'active' | 'completed';
    issueIds: string[];
}

export interface Version {
    id: string;
    name: string;
    description?: string;
    releaseDate?: string;
    status: 'unreleased' | 'released';
    issueIds: string[];
}

export interface Dashboard {
    id: string;
    name: string;
    widgets: Widget[];
}

export interface Widget {
    id: string;
    type: 'my-work' | 'sprint-burndown' | 'cumulative-flow' | 'team-workload' | 'velocity';
    title: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  avatarUrl: string;
  columns: ColumnData[];
  issues: Issue[];
  sprints: Sprint[];
  versions: Version[];
  dashboards: Dashboard[];
  automationRules?: AutomationRule[];
  ruleRuns?: RuleRun[];
}

export type Permission = 
    | 'project:settings'
    | 'user:manage'
    | 'user:read'
    | 'issue:create'
    | 'issue:edit'
    | 'issue:delete'
    | 'billing:manage';

export interface RolePermission {
    name: Role;
    permissions: Permission[];
}

export type SwimlaneBy = 'none' | 'assignee';

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
}

export interface AuditLog {
    id: string;
    actor: User;
    action: string;
    details: Record<string, any>;
    timestamp: string;
}

export type TriggerType = 'issue-created' | 'issue-updated' | 'comment-added' | 'scheduled';
export type ConditionField = 'status' | 'priority' | 'type' | 'assignees' | 'labels';
export type ConditionOperator = 'is' | 'is-not' | 'changed-to' | 'contains' | 'is-empty';
export type ActionType = 'transition-to' | 'add-comment' | 'set-priority' | 'add-label' | 'assign-to';

export interface RuleTrigger {
    type: TriggerType;
}

export interface RuleCondition {
    id: string;
    field: ConditionField;
    operator: ConditionOperator;
    value: any;
}

export interface RuleAction {
    id: string;
    type: ActionType;
    value: any;
}

export interface AutomationRule {
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    trigger: RuleTrigger;
    conditions: RuleCondition[];
    actions: RuleAction[];
}

export interface RuleRun {
    id: string;
    ruleId: string;
    timestamp: string;
    triggeringEvent: string;
    status: 'success' | 'failure';
    result: string;
    details: Record<string, any>;
}

export interface ScheduledExport {
    id: string;
    reportName: string;
    recipients: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
}

export interface DailySnapshot {
    date: string; // YYYY-MM-DD
    statusCounts: Record<string, number>;
}

// FIX: Add AppView type to be shared across components.
export type AppView = 'board' | 'admin' | 'backlog' | 'releases' | 'reports' | 'active_sprint' | 'dashboards' | 'account';

export interface QueuedAction {
    id: string;
    type: string;
    payload: Record<string, any>;
    status: 'pending' | 'success' | 'failed';
    error?: string;
    timestamp: number;
}