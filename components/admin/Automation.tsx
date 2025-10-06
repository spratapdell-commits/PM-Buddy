
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { AutomationRule, RuleRun, Project } from '../../types';
// FIX: Changed import to be relative
import { PlusIcon, WandSparklesIcon } from '../Icons';
import RuleBuilder from './automation/RuleBuilder';
import RuleHistory from './automation/RuleHistory';

interface AutomationProps {
    rules: AutomationRule[];
    setRules: React.Dispatch<React.SetStateAction<AutomationRule[]>>;
    runs: RuleRun[];
    project: Project;
}

const Automation: React.FC<AutomationProps> = ({ rules, setRules, runs, project }) => {
    const [view, setView] = useState<'list' | 'builder' | 'history'>('list');
    const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

    const handleSaveRule = (ruleToSave: AutomationRule) => {
        setRules(prev => {
            const exists = prev.some(r => r.id === ruleToSave.id);
            if (exists) {
                return prev.map(r => r.id === ruleToSave.id ? ruleToSave : r);
            }
            return [...prev, ruleToSave];
        });
        setView('list');
        setSelectedRule(null);
    };

    const handleCreateNew = () => {
        setSelectedRule(null);
        setView('builder');
    };

    const handleEdit = (rule: AutomationRule) => {
        setSelectedRule(rule);
        setView('builder');
    };
    
    const handleViewHistory = (rule: AutomationRule) => {
        setSelectedRule(rule);
        setView('history');
    };

    const toggleRule = (ruleId: string, isEnabled: boolean) => {
        setRules(rules.map(r => r.id === ruleId ? { ...r, isEnabled } : r));
    };

    if (view === 'builder') {
        return <RuleBuilder 
                    rule={selectedRule} 
                    onSave={handleSaveRule} 
                    onCancel={() => setView('list')} 
                    project={project} 
                />
    }
    
    if (view === 'history' && selectedRule) {
        return <RuleHistory 
                    rule={selectedRule}
                    runs={runs.filter(r => r.ruleId === selectedRule.id)}
                    onBack={() => setView('list')}
                />
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Automation</h1>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center space-x-2 bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Create Rule</span>
                </button>
            </div>
            <p className="text-pm-text-secondary mb-6">Automate your team's processes. Create simple "if this, then that" rules to remove manual steps from your workflow.</p>

            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <ul className="divide-y divide-pm-border">
                    {rules.map(rule => (
                        <li key={rule.id} className="p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <WandSparklesIcon className="w-6 h-6 text-pm-purple flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">{rule.name}</p>
                                    <p className="text-sm text-pm-text-secondary">{rule.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={rule.isEnabled} onChange={(e) => toggleRule(rule.id, e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-pm-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pm-blue"></div>
                                </label>
                                <button onClick={() => handleEdit(rule)} className="text-sm font-medium text-pm-blue hover:underline">Edit</button>
                                <button onClick={() => handleViewHistory(rule)} className="text-sm text-pm-text-secondary hover:underline">History</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Automation;
