
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { ScheduledExport } from '../../types';
// FIX: Changed import to be relative
import { XMarkIcon } from '../Icons';

interface ScheduleExportModalProps {
    onClose: () => void;
    onSave: (newExport: Omit<ScheduledExport, 'id'>) => void;
}

const ScheduleExportModal: React.FC<ScheduleExportModalProps> = ({ onClose, onSave }) => {
    const [reportName, setReportName] = useState('');
    const [recipients, setRecipients] = useState('');
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic email validation
        const emailList = recipients.split(',').map(e => e.trim()).filter(e => e.includes('@'));
        if (reportName && emailList.length > 0) {
            onSave({ reportName, recipients: emailList, frequency });
            onClose();
            // In a real app, this would call a backend service.
            // The backend would use a secure email provider like AWS SES or SendGrid.
            // The API key for the email service would be stored as an environment variable, not in code.
            // e.g. const EMAIL_API_KEY = process.env.EMAIL_PROVIDER_API_KEY; // SECRET: Add to secret manager
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-pm-dark-secondary rounded-lg shadow-xl w-full max-w-lg flex flex-col border border-pm-border" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-pm-border">
                    <h2 className="text-lg font-semibold">Schedule a New Export</h2>
                    <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-pm-border text-pm-text-secondary"><XMarkIcon className="w-5 h-5" /></button>
                </header>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="reportName" className="block text-sm font-medium text-pm-text-secondary mb-1">Report Name</label>
                        <input
                            id="reportName"
                            type="text"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            placeholder="e.g., Weekly Project Summary"
                            required
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="recipients" className="block text-sm font-medium text-pm-text-secondary mb-1">Recipients</label>
                        <textarea
                            id="recipients"
                            value={recipients}
                            onChange={(e) => setRecipients(e.target.value)}
                            placeholder="Enter email addresses, separated by commas"
                            required
                            rows={3}
                            className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        />
                    </div>
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-pm-text-secondary mb-1">Frequency</label>
                        <select
                             id="frequency"
                             value={frequency}
                             onChange={(e) => setFrequency(e.target.value as any)}
                             className="w-full bg-pm-dark border border-pm-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>
                <footer className="p-4 bg-pm-dark border-t border-pm-border flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md hover:bg-pm-border">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm rounded-md bg-pm-blue text-white font-semibold">Save Schedule</button>
                </footer>
            </form>
        </div>
    );
};

export default ScheduleExportModal;
