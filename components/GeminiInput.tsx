
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Changed import to be relative
import { Issue, IssuePriority, IssueType, User } from '../types';
// FIX: Changed import to be relative
import { SparklesIcon } from './Icons';
// FIX: Changed import to be relative
import { ROLE_PERMISSIONS } from '../constants';

interface GeminiInputProps {
  onTaskCreate: (issue: Issue) => void;
  users: User[];
  projectKey: string;
  currentUser: User;
}

// FIX: Define a type for the data parsed from Gemini to match the response schema.
interface GeminiParsedData {
  summary?: string;
  type?: IssueType;
  priority?: IssuePriority;
  assigneeNames?: string[];
  storyPoints?: number | null;
}

const GeminiInput: React.FC<GeminiInputProps> = ({ onTaskCreate, users, projectKey, currentUser }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreateIssue = ROLE_PERMISSIONS.find(rp => rp.name === currentUser.role)?.permissions.includes('issue:create') ?? false;

  const parseWithGemini = async (prompt: string): Promise<GeminiParsedData | null> => {
    // This check is for the browser environment where process.env might not be defined.
    // In a real app, API_KEY should be handled securely on a backend.
    if (typeof process === 'undefined' || !process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      setError("AI service is not configured. Please set the API_KEY.");
      return null;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const userNames = users.map(u => u.name).join(', ');
    const issueTypes = Object.values(IssueType).join(', ');
    const priorities = Object.values(IssuePriority).join(', ');

    const systemInstruction = `You are an intelligent assistant for a project management tool. Your task is to parse a user's natural language input into a structured JSON object for creating a new issue.
    
    - The issue type must be one of: ${issueTypes}. Default to 'Task' if unspecified.
    - The priority must be one of: ${priorities}. Default to 'Medium' if unspecified.
    - Assignees should be matched from this list of available users: ${userNames}. If a user is mentioned who is not on this list, leave assignees empty. An issue can have multiple assignees.
    - The summary should be a concise title for the issue.
    - Story points should be a number if mentioned, otherwise null.
    - Always return a valid JSON object matching the provided schema.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'A concise summary of the task.' },
              type: { type: Type.STRING, enum: Object.values(IssueType), description: `The type of the issue. Must be one of: ${issueTypes}.` },
              priority: { type: Type.STRING, enum: Object.values(IssuePriority), description: `The priority of the issue. Must be one of: ${priorities}.` },
              assigneeNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: `An array of assignee names matching users from the provided list: ${userNames}.` },
              storyPoints: { type: Type.NUMBER, nullable: true, description: 'The estimated story points for the issue.' },
            }
          },
        }
      });
      const jsonStr = response.text.trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Error parsing with Gemini:", e);
      setError("Sorry, I couldn't understand that. Please try rephrasing.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const parsedData = await parseWithGemini(inputValue);

    setIsLoading(false);
    if (parsedData) {
      const assignees = users.filter(u => parsedData.assigneeNames?.includes(u.name));
      
      const newIssue: Issue = {
        id: `i-${Date.now()}`,
        key: `${projectKey}-${Math.floor(Math.random() * 900) + 100}`,
        summary: parsedData.summary || 'Untitled Task',
        description: `Task created from prompt: "${inputValue}"`,
        type: (parsedData.type as IssueType) || IssueType.TASK,
        priority: (parsedData.priority as IssuePriority) || IssuePriority.MEDIUM,
        status: 'To Do',
        assignees: assignees,
        reporterId: currentUser.id,
        labels: [],
        storyPoints: parsedData.storyPoints || null,
        comments: [],
        attachments: [],
        history: [],
        // FIX: Add missing 'rank' property to satisfy the Issue type.
        rank: new Date().toISOString(),
      };
      
      onTaskCreate(newIssue);
      setInputValue('');
    }
  };
  
  if (!canCreateIssue) {
    return null;
  }

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="relative">
        <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-purple" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder="Create bug 'UI glitch on login' for Alex with high priority..."
          className="w-full bg-pm-dark border border-pm-border rounded-md pl-10 pr-24 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue placeholder:text-pm-text-secondary"
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-pm-blue text-white px-3 py-1 rounded-md text-sm font-semibold disabled:bg-pm-blue/50 disabled:cursor-not-allowed">
          {isLoading ? 'Creating...' : 'Add'}
        </button>
      </form>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default GeminiInput;
