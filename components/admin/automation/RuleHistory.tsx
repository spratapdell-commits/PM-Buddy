
import React from 'react';
// FIX: Changed import to be relative
import { AutomationRule, RuleRun } from '../../../types';
// FIX: Changed import to be relative
import { ArrowLeftIcon } from '../../Icons';

interface RuleHistoryProps {
    rule: AutomationRule;
    runs: RuleRun[];
    onBack: () => void;
}

const RuleHistory: React.FC<RuleHistoryProps> = ({ rule, runs, onBack }) => {
    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-pm-border mr-2"><ArrowLeftIcon className="w-5 h-5" /></button>
                <div>
                    <h1 className="text-2xl font-bold">Automation History</h1>
                    <p className="text-pm-text-secondary">Showing runs for rule: <span className="font-semibold text-pm-text">{rule.name}</span></p>
                </div>
            </div>

            <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-pm-text-secondary uppercase border-b border-pm-border">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Trigger</th>
                            <th scope="col" className="px-6 py-3">Result</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {runs.map((run) => (
                            <tr key={run.id} className="border-b border-pm-border last:border-b-0">
                                <td className="px-6 py-4 text-pm-text-secondary">{new Date(run.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4">{run.triggeringEvent}</td>
                                <td className="px-6 py-4">
                                    <details>
                                        <summary className="cursor-pointer hover:underline">{run.result}</summary>
                                        <pre className="mt-2 text-xs bg-pm-dark p-2 rounded text-pm-text-secondary overflow-x-auto">
                                            {JSON.stringify(run.details, null, 2)}
                                        </pre>
                                    </details>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${run.status === 'success' ? 'bg-pm-green/20 text-pm-green' : 'bg-pm-red/20 text-pm-red'}`}>
                                        {run.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                         {runs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-pm-text-secondary">No run history for this rule.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RuleHistory;
