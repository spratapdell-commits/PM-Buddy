
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { AutomationRule, RuleCondition, RuleAction, RuleTrigger, Project, IssueType, IssuePriority, ConditionField, ActionType, ConditionOperator, TriggerType } from '../../../types';
// FIX: Changed import to be relative
import { USERS } from '../../../constants';
// FIX: Changed import to be relative
import { PlusIcon, TrashIcon, WandSparklesIcon } from '../../Icons';
import RuleSimulator from './RuleSimulator';

interface RuleBuilderProps {
    rule: AutomationRule | null;
    onSave: (rule: AutomationRule) => void;
    onCancel: () => void;
    project: Project;
}

const NEW_RULE_TEMPLATE: Omit<AutomationRule, 'id'> = {
    name: '',
    description: '',
    isEnabled: true,
    trigger: { type: 'issue-created' },
    conditions: [],
    actions: [],
};

const RuleBuilder: React.FC<RuleBuilderProps> = ({ rule, onSave, onCancel, project }) => {
    const [currentRule, setCurrentRule] = useState<Omit<AutomationRule, 'id'> & { id?: string }>(
        rule ? { ...rule } : NEW_RULE_TEMPLATE
    );
    const [isSimulating, setIsSimulating] = useState(false);

    const updateField = (field: keyof AutomationRule, value: any) => {
        setCurrentRule(prev => ({ ...prev, [field]: value }));
    };

    const addCondition = () => {
        const newCondition: RuleCondition = {
            id: `c-${Date.now()}`,
            field: 'status',
            operator: 'is',
            value: project.columns[0]?.title || '',
        };
        updateField('conditions', [...currentRule.conditions, newCondition]);
    };
    
    const updateCondition = (id: string, newCondition: Partial<RuleCondition>) => {
        updateField('conditions', currentRule.conditions.map(c => c.id === id ? { ...c, ...newCondition } : c));
    };
    
    const removeCondition = (id: string) => {
        updateField('conditions', currentRule.conditions.filter(c => c.id !== id));
    };
    
    const addAction = () => {
        const newAction: RuleAction = {
            id: `a-${Date.now()}`,
            type: 'transition-to',
            value: project.columns[0]?.title || '',
        };
        updateField('actions', [...currentRule.actions, newAction]);
    };

    const updateAction = (id: string, newAction: Partial<RuleAction>) => {
        // FIX: Corrected typo from 'c' to 'a' in the map function's else branch.
        updateField('actions', currentRule.actions.map(a => a.id === id ? { ...a, ...newAction } : a));
    };

    const removeAction = (id: string) => {
        updateField('actions', currentRule.actions.filter(a => a.id !== id));
    };

    const handleSave = () => {
        const finalRule: AutomationRule = {
            id: rule?.id || `rule-${Date.now()}`,
            ...currentRule,
        };
        onSave(finalRule);
    };

    const renderValueInput = (
        item: RuleCondition | RuleAction, 
        onChange: (value: any) => void
    ) => {
        const field = 'field' in item ? item.field : item.type;
        switch (field) {
            case 'status':
            case 'transition-to':
// FIX: Cast item.value to string to resolve TypeScript error.
                return <select value={item.value as string} onChange={e => onChange(e.target.value)} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full"><>
                    {project.columns.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                </></select>
            case 'priority':
            case 'set-priority':
// FIX: Cast item.value to string to resolve TypeScript error.
                return <select value={item.value as string} onChange={e => onChange(e.target.value)} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full"><>
                    {Object.values(IssuePriority).map(p => <option key={p} value={p}>{p}</option>)}
                </></select>
            case 'type':
// FIX: Cast item.value to string to resolve TypeScript error.
                return <select value={item.value as string} onChange={e => onChange(e.target.value)} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full"><>
                    {Object.values(IssueType).map(t => <option key={t} value={t}>{t}</option>)}
                </></select>
            case 'assign-to':
            case 'assignees':
// FIX: Cast item.value to string and corrected onChange to pass a single value.
                return <select value={item.value as string} onChange={e => onChange(e.target.value)} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full"><>
                    {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </></select>
            case 'add-comment':
                return <textarea value={Array.isArray(item.value) ? item.value.join(', ') : item.value as string} onChange={e => onChange(e.target.value)} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full" rows={2}></textarea>
            case 'add-label':
            case 'labels':
                 return <input type="text" value={Array.isArray(item.value) ? item.value.join(', ') : item.value as string} onChange={e => onChange(e.target.value)} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-full" />
            default:
                return null;
        }
    };

    return (<>
        <div>
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{rule ? 'Edit Rule' : 'Create Rule'}</h1>
                <div className="flex space-x-2">
                     <button onClick={() => setIsSimulating(true)} className="flex items-center space-x-2 bg-pm-dark-secondary border border-pm-border text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-border transition-colors">
                        <WandSparklesIcon className="w-5 h-5" />
                        <span>Simulate</span>
                    </button>
                    <button onClick={onCancel} className="bg-pm-dark-secondary border border-pm-border text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-border transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors">Save Rule</button>
                </div>
            </div>

            <div className="space-y-8 max-w-4xl">
                {/* Rule Name and Description */}
                <div className="bg-pm-dark-secondary p-6 rounded-lg border border-pm-border">
                    <input type="text" placeholder="Rule name..." value={currentRule.name} onChange={e => updateField('name', e.target.value)} className="text-lg font-semibold w-full bg-transparent focus:outline-none mb-2"/>
                    <textarea placeholder="Rule description..." value={currentRule.description} onChange={e => updateField('description', e.target.value)} className="text-sm w-full bg-transparent focus:outline-none text-pm-text-secondary" rows={2}/>
                </div>

                {/* WHEN - Trigger */}
                <div className="bg-pm-dark-secondary p-6 rounded-lg border border-pm-border">
                    <h2 className="font-bold text-lg mb-4">WHEN</h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-pm-text-secondary">This rule runs when an</span>
                        <select value={currentRule.trigger.type} onChange={e => updateField('trigger', {type: e.target.value as TriggerType})} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm">
                            <option value="issue-created">Issue is Created</option>
                            <option value="issue-updated">Issue is Updated</option>
                            <option value="comment-added">Comment is Added</option>
                            <option value="scheduled">On a Schedule</option>
                        </select>
                    </div>
                </div>

                {/* IF - Conditions */}
                <div className="bg-pm-dark-secondary p-6 rounded-lg border border-pm-border">
                    <h2 className="font-bold text-lg mb-4">IF</h2>
                    <div className="space-y-3">
                        {currentRule.conditions.map(cond => (
                            <div key={cond.id} className="flex items-center space-x-2">
                                <select value={cond.field} onChange={e => updateCondition(cond.id, {field: e.target.value as ConditionField})} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-1/4">
                                    <option value="status">Status</option>
                                    <option value="priority">Priority</option>
                                    <option value="type">Type</option>
                                    <option value="assignees">Assignees</option>
                                    <option value="labels">Labels</option>
                                </select>
                                <select value={cond.operator} onChange={e => updateCondition(cond.id, {operator: e.target.value as ConditionOperator})} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-1/4">
                                     <option value="is">is</option>
                                     <option value="is-not">is not</option>
                                     <option value="changed-to">changed to</option>
                                     <option value="contains">contains</option>
                                     <option value="is-empty">is empty</option>
                                </select>
                                <div className="w-2/4">{renderValueInput(cond, (value) => updateCondition(cond.id, { value }))}</div>
                                <button onClick={() => removeCondition(cond.id)} className="p-1 text-pm-text-secondary hover:text-pm-red"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addCondition} className="mt-4 flex items-center space-x-1 text-sm text-pm-blue font-semibold"><PlusIcon className="w-4 h-4"/><span>Add condition</span></button>
                </div>
                
                {/* THEN - Actions */}
                <div className="bg-pm-dark-secondary p-6 rounded-lg border border-pm-border">
                     <h2 className="font-bold text-lg mb-4">THEN</h2>
                     <div className="space-y-3">
                        {currentRule.actions.map(act => (
                            <div key={act.id} className="flex items-center space-x-2">
                                <select value={act.type} onChange={e => updateAction(act.id, {type: e.target.value as ActionType})} className="bg-pm-dark border border-pm-border rounded-md px-2 py-1 text-sm w-1/3">
                                    <option value="transition-to">Transition to</option>
                                    <option value="add-comment">Add comment</option>
                                    <option value="set-priority">Set priority</option>
                                    <option value="add-label">Add label</option>
                                    <option value="assign-to">Assign to</option>
                                </select>
                                <div className="w-2/3">{renderValueInput(act, (value) => updateAction(act.id, { value }))}</div>
                                <button onClick={() => removeAction(act.id)} className="p-1 text-pm-text-secondary hover:text-pm-red"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                     </div>
                     <button onClick={addAction} className="mt-4 flex items-center space-x-1 text-sm text-pm-blue font-semibold"><PlusIcon className="w-4 h-4"/><span>Add action</span></button>
                </div>
            </div>
        </div>
        {isSimulating && (
            <RuleSimulator 
                rule={{id: 'sim-1', ...currentRule}}
                project={project}
                onClose={() => setIsSimulating(false)}
            />
        )}
    </>);
};

export default RuleBuilder;
