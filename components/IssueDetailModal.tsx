
import React, { useState, useRef } from 'react';
import { Issue, Project, User, IssueType, IssuePriority, Attachment as AttachmentType } from '../types';
import { USERS } from '../constants';
// FIX: Removed unused and non-existent icons 'FlagIcon' and 'ClockIcon'. The other missing icons are now defined in Icons.tsx.
import { XMarkIcon, PaperClipIcon, LinkIcon, TrashIcon, EllipsisHorizontalIcon, ChevronDownIcon, UserCircleIcon, PlusIcon } from './Icons';
import RichEditor from './RichEditor';
import Attachment from './Attachment';

interface IssueDetailPanelProps {
  issue: Issue;
  project: Project;
  onClose: () => void;
  onUpdate: (issue: Issue) => void;
  currentUser: User;
  logAction: (actor: User, action: string, details: Record<string, any>) => void;
}

const IssueDetailPanel: React.FC<IssueDetailPanelProps> = ({ issue: initialIssue, project, onClose, onUpdate, currentUser, logAction }) => {
  const [issue, setIssue] = useState<Issue>(initialIssue);
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof Issue>(field: K, value: Issue[K]) => {
    const updatedIssue = { ...issue, [field]: value };
    setIssue(updatedIssue);
    onUpdate(updatedIssue);
    // FIX: Explicitly cast 'field' to a string to prevent runtime error with symbol keys.
    logAction(currentUser, `issue.${String(field)}.update`, { issueKey: issue.key, newValue: value });
  };
  
  const handleCommentSave = (comment: string) => {
    if(!comment.trim()) return;
    const newCommentObj = {
        id: `c-${Date.now()}`,
        author: currentUser,
        content: comment,
        timestamp: new Date().toISOString()
    };
    updateField('comments', [newCommentObj, ...issue.comments]);
    setNewComment('');
  }
  
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const newAttachments: AttachmentType[] = files.map(file => ({
            id: `att-${Date.now()}-${file.name}`,
            fileName: file.name,
            url: URL.createObjectURL(file), // Use blob URL for preview
            mimeType: file.type,
            size: file.size
        }));
        updateField('attachments', [...issue.attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
      updateField('attachments', issue.attachments.filter(att => att.id !== id));
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-30" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-2xl bg-pm-dark-secondary shadow-2xl flex flex-col"
      >
        {/* Header */}
        <header className="p-3 border-b border-pm-border flex-shrink-0">
            <div className="flex items-center justify-between">
                <span className="text-sm text-pm-text-secondary hover:underline cursor-pointer">{issue.key}</span>
                <div className="flex items-center space-x-2">
                    <button className="p-1.5 text-pm-text-secondary rounded-md hover:bg-pm-border"><PaperClipIcon className="w-5 h-5"/></button>
                    <button className="p-1.5 text-pm-text-secondary rounded-md hover:bg-pm-border"><LinkIcon className="w-5 h-5"/></button>
                    <button className="p-1.5 text-pm-text-secondary rounded-md hover:bg-pm-border"><TrashIcon className="w-5 h-5"/></button>
                    <button className="p-1.5 text-pm-text-secondary rounded-md hover:bg-pm-border"><EllipsisHorizontalIcon className="w-5 h-5"/></button>
                    <button onClick={onClose} className="p-1.5 text-pm-text-secondary rounded-md hover:bg-pm-border"><XMarkIcon className="w-5 h-5"/></button>
                </div>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 p-6 overflow-y-auto space-y-6">
                <input 
                    type="text" 
                    value={issue.summary}
                    onChange={(e) => setIssue({...issue, summary: e.target.value})}
                    onBlur={(e) => updateField('summary', e.target.value)}
                    className="text-2xl font-bold bg-transparent w-full focus:outline-none focus:bg-pm-dark rounded-md -ml-2 px-2 py-1"
                />

                <div>
                    <h3 className="text-sm font-semibold text-pm-text-secondary mb-2">Description</h3>
                    <RichEditor 
                        value={issue.description} 
                        onChange={val => setIssue({...issue, description: val})}
                        onSave={val => updateField('description', val)}
                    />
                </div>
                
                 <div>
                    <h3 className="text-sm font-semibold text-pm-text-secondary mb-2">Attachments</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {issue.attachments.map(att => <Attachment key={att.id} attachment={att} onRemove={removeAttachment} />)}
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center w-full h-24 bg-pm-dark border-2 border-dashed border-pm-border rounded-lg hover:border-pm-blue">
                            <PlusIcon className="w-6 h-6 text-pm-text-secondary"/>
                        </button>
                        <input type="file" multiple ref={fileInputRef} onChange={handleAttachmentUpload} className="hidden" />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-pm-text-secondary mb-2">Comments</h3>
                    <div className="flex items-start space-x-3">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                            <RichEditor 
                                small 
                                value={newComment}
                                onChange={setNewComment}
                                onSave={handleCommentSave}
                                placeholder="Add a comment..."
                            />
                        </div>
                    </div>
                     <div className="mt-4 space-y-4">
                        {issue.comments.map(c => (
                             <div key={c.id} className="flex items-start space-x-3">
                                <img src={c.author.avatarUrl} alt={c.author.name} className="w-8 h-8 rounded-full" />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-sm">{c.author.name}</span>
                                        <span className="text-xs text-pm-text-secondary">{new Date(c.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="prose prose-invert prose-sm max-w-none mt-1">
                                       <pre className="whitespace-pre-wrap font-sans text-pm-text">{c.content}</pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
            <aside className="w-64 p-4 border-l border-pm-border overflow-y-auto flex-shrink-0">
                <div className="space-y-4">
                    <DetailItem label="Status">
                         <select 
                            value={issue.status}
                            onChange={(e) => updateField('status', e.target.value)}
                            className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pm-blue"
                        >
                            {project.columns.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                        </select>
                    </DetailItem>
                    <DetailItem label="Assignees">
                         <select 
                            // This is simplified for single-assignee. A real app would need a multi-select component.
                            value={issue.assignees[0]?.id || ''}
                            onChange={(e) => {
                                const user = USERS.find(u => u.id === e.target.value);
                                updateField('assignees', user ? [user] : []);
                            }}
                            className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pm-blue"
                        >
                            <option value="">Unassigned</option>
                            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </DetailItem>
                    <DetailItem label="Reporter">
                        <UserDisplay userId={issue.reporterId} />
                    </DetailItem>
                     <DetailItem label="Priority">
                         <select 
                            value={issue.priority}
                            onChange={(e) => updateField('priority', e.target.value as IssuePriority)}
                            className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-pm-blue"
                        >
                            {Object.values(IssuePriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </DetailItem>
                     <DetailItem label="Story Points">
                        <input
                            type="number"
                            value={issue.storyPoints || ''}
                            onChange={(e) => updateField('storyPoints', e.target.value ? parseInt(e.target.value) : null)}
                            className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full"
                         />
                    </DetailItem>
                </div>
            </aside>
        </div>
      </div>
    </div>
  );
};


const DetailItem: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <h4 className="text-xs font-semibold text-pm-text-secondary uppercase mb-1">{label}</h4>
        <div>{children}</div>
    </div>
);

const UserDisplay: React.FC<{userId: string}> = ({userId}) => {
    const user = USERS.find(u => u.id === userId);
    if (!user) return <div className="text-sm text-pm-text-secondary">Unknown User</div>;
    return (
        <div className="flex items-center space-x-2">
            <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
            <span className="text-sm">{user.name}</span>
        </div>
    );
};

export default IssueDetailPanel;
