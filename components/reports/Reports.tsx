
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { Project, ScheduledExport } from '../../types';
import VelocityChart from '../charts/VelocityChart';
import ThroughputChart from '../charts/ThroughputChart';
import LeadTimeChart from '../charts/LeadTimeChart';
import CumulativeFlowDiagram from '../charts/CumulativeFlowDiagram';
// FIX: Changed import to be relative
import { MOCK_SNAPSHOTS } from '../../constants';
// FIX: Changed import to be relative
import { PlusIcon } from '../Icons';
import ScheduleExportModal from './ScheduleExportModal';

const Reports: React.FC<{ project: Project }> = ({ project }) => {
    const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const handleSaveExport = (newExport: Omit<ScheduledExport, 'id'>) => {
        setScheduledExports(prev => [...prev, { ...newExport, id: `se-${Date.now()}` }]);
    };

    return (<>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Reports</h1>
             <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center space-x-2 bg-pm-blue text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-pm-blue/90 transition-colors"
            >
                <PlusIcon className="w-5 h-5"/>
                <span>Schedule Export</span>
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Velocity Chart"><VelocityChart project={project} /></ReportCard>
            <ReportCard title="Throughput (Last 8 Weeks)"><ThroughputChart issues={project.issues} /></ReportCard>
            <ReportCard title="Lead Time Histogram"><LeadTimeChart issues={project.issues} /></ReportCard>
            <ReportCard title="Cumulative Flow Diagram"><CumulativeFlowDiagram snapshots={MOCK_SNAPSHOTS} /></ReportCard>
        </div>
        
        {isScheduleModalOpen && (
            <ScheduleExportModal
                onClose={() => setIsScheduleModalOpen(false)}
                onSave={handleSaveExport}
            />
        )}
    </>);
};

const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-pm-dark-secondary rounded-lg border border-pm-border">
        <h2 className="text-md font-semibold p-4 border-b border-pm-border">{title}</h2>
        <div className="p-4" style={{ height: '250px' }}>
            {children}
        </div>
    </div>
);

export default Reports;
