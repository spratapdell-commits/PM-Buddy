import { User, ColumnData, Issue } from './types';
// FIX: Corrected import from MOCK_PROJECT to MOCK_PROJECTS and updated API functions to use it.
import { USERS, MOCK_PROJECTS } from './constants';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchMe = async (): Promise<User | null> => {
    await delay(300);
    // In a real app, this would be determined by a session.
    // For this mock, we'll return null to force the login screen initially.
    return null; 
};

export const fetchBoard = async (projectId: string): Promise<ColumnData[]> => {
    await delay(500);
    // In a real app, you would fetch data for the given projectId
    // For this mock, we find the project in the mock data array.
    console.log(`Fetching board for project ${projectId}`);
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    return project ? project.columns : [];
};

export const fetchIssues = async (projectId: string): Promise<Issue[]> => {
    await delay(700);
     // In a real app, you would fetch data for the given projectId
    // For this mock, we find the project in the mock data array.
    console.log(`Fetching issues for project ${projectId}`);
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    return project ? project.issues : [];
};
