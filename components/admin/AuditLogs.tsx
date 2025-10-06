
import React, { useState, useMemo } from 'react';
// FIX: Changed import to be relative
import { AuditLog } from '../../types';

interface AuditLogsProps {
  logs: AuditLog[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
    const [filterActor, setFilterActor] = useState('');
    const [filterDate, setFilterDate] = useState('');

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const actorMatch = filterActor ? log.actor.name.toLowerCase().includes(filterActor.toLowerCase()) : true;
            const dateMatch = filterDate ? log.timestamp.startsWith(filterDate) : true;
            return actorMatch && dateMatch;
        });
    }, [logs, filterActor, filterDate]);

    const exportToCSV = () => {
        const headers = ['Timestamp', 'Actor', 'Action', 'Details'];
        const rows = filteredLogs.map(log => [
            log.timestamp,
            log.actor.name,
            log.action,
            JSON.stringify(log.details)
        ]);
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_log.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <button 
          onClick={exportToCSV}
          className="bg-pm-green/20 text-pm-green px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-green/30 transition-colors"
        >
            Export as CSV
        </button>
      </div>

      <div className="mb-4 flex space-x-4">
        <input 
            type="text"
            placeholder="Filter by actor..."
            value={filterActor}
            onChange={(e) => setFilterActor(e.target.value)}
            className="bg-pm-dark border border-pm-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pm-blue"
        />
        <input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-pm-dark border border-pm-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pm-blue"
        />
      </div>

      <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-pm-text-secondary uppercase border-b border-pm-border">
            <tr>
              <th scope="col" className="px-6 py-3">Actor</th>
              <th scope="col" className="px-6 py-3">Action</th>
              <th scope="col" className="px-6 py-3">Details</th>
              <th scope="col" className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-pm-border last:border-b-0">
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <img className="w-6 h-6 rounded-full" src={log.actor.avatarUrl} alt={log.actor.name} />
                        <span>{log.actor.name}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-pm-border rounded px-1.5 py-0.5">{log.action}</span>
                </td>
                <td className="px-6 py-4">
                    <pre className="text-xs text-pm-text-secondary overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                    </pre>
                </td>
                <td className="px-6 py-4 text-pm-text-secondary">
                    {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
