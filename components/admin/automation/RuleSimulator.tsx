
import React, { useState, useMemo } from 'react';
// FIX: Changed import to be relative
import { AutomationRule, Project, Issue } from '../../../types';
// FIX: Changed import to be relative
import { XMarkIcon } from '../../Icons';

interface RuleSimulatorProps {
    rule: AutomationRule;
    project: Project;
    onClose: () => void;
}

// A simplified mock of the rule execution engine for simulation purposes.
// A real engine would be far more complex, handling async operations, API calls, etc.
const runSimulation = (rule: AutomationRule, issue: Issue) => {
    const log: { type: 'condition' | 'action', text: string, met: boolean }[] = [];
    let allConditionsMet = true;

    rule.conditions.forEach(cond => {
        let isMet = false;
        // This is a very simplified check
        switch (cond.field) {
            case 'status':
                if (cond.operator === 'is') isMet = issue.status === cond.value;
                if (cond.operator === 'is-not') isMet = issue.status !== cond.value;
                break;
            case 'priority':
                if (cond.operator === 'is') isMet = issue.priority === cond.value;
                break;
            case 'type':
                if (cond.operator === 'is') isMet = issue.type === cond.value;
                break;
            case 'assignees':
                if (cond.operator === 'is-empty') isMet = issue.assignees.length === 0;
                break;
        }
        if (!isMet) allConditionsMet = false;
        log.push({
            type: 'condition',
            text: `Check if ${cond.field} ${cond.operator} "${cond.value}"`,
            met: isMet
        });
    });

    if (allConditionsMet) {
        rule.actions.forEach(action => {
            log.push({
                type: 'action',
                text: `Perform action: ${action.type} with value "${action.value}"`,
                met: true
            });
        });
    } else {
        log.push({
            type: 'action',
            text: 'Conditions not met. No actions will be performed.',
            met: false,
        });
    }
    
    return log;
};


const RuleSimulator: React.FC<RuleSimulatorProps> = ({ rule, project, onClose }) => {
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(project.issues[0]?.id || null);
    
    const simulationLog = useMemo(() => {
        if (!selectedIssueId) return [];
        const issue = project.issues.find(i => i.id === selectedIssueId);
        if (!issue) return [];
        return runSimulation(rule, issue);
    }, [rule, selectedIssueId, project.issues]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-2xl h-[70vh] flex flex-col border border-pm-border">
                <header className="flex items-center justify-between p-4 border-b border-pm-border flex-shrink-0">
                    <h2 className="text-lg font-semibold">Rule Simulator</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="mb-4">
                        <label className="text-sm font-medium text-pm-text-secondary block mb-1">Test rule against issue:</label>
                        <select 
                            value={selectedIssueId || ''} 
                            onChange={e => setSelectedIssueId(e.target.value)}
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-2 py-1.5 text-sm"
                        >
                            {project.issues.map(issue => (
                                <option key={issue.id} value={issue.id}>
                                    {issue.key}: {issue.summary}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-pm-dark p-4 rounded-md border border-pm-border font-mono text-xs">
                        <h3 className="font-semibold text-sm mb-2 text-pm-text">Simulation Log</h3>
                        <div className="space-y-1">
                             {simulationLog.map((log, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className={`font-bold ${log.met ? 'text-pm-green' : 'text-pm-red'}`}>
                                       {log.type === 'condition' && (log.met ? '✅' : '❌')}
                                       {log.type === 'action' && (log.met ? '▶️' : '🛑')}
                                    </span>
                                    <span className={!log.met ? 'text-pm-text-secondary' : ''}>{log.text}</span>
                                </div>
                            ))}
                            {!selectedIssueId && <p className="text-pm-text-secondary">Select an issue to begin simulation.</p>}
                        </div>
                    </div>
                    <p className="text-xs text-pm-text-secondary mt-4 text-center">
                        This is a simulation. No actual changes will be made to your issues.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RuleSimulator;
