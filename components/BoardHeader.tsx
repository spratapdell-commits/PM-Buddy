
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { Project, SwimlaneBy, User } from '../types';
// FIX: Changed import to be relative
import { SearchIcon, AdjustmentsHorizontalIcon, ViewColumnsIcon, UserIcon } from './Icons';

interface BoardHeaderProps {
  project: Project;
  currentSwimlane: SwimlaneBy;
  onSwimlaneChange: (by: SwimlaneBy) => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ project, currentSwimlane, onSwimlaneChange }) => {
  const [isSwimlaneOpen, setIsSwimlaneOpen] = useState(false);
  
  // FIX: Explicitly provided generic arguments to `new Map()` to correct a type inference failure.
  const allUsersOnBoard: User[] = Array.from(new Map<string, User>(project.issues.flatMap(i => i.assignees).map(u => [u.id, u])).values());

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-shrink-0">
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pm-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-48 bg-pm-dark border border-pm-border rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pm-blue"
          />
        </div>
        <div className="flex -space-x-2">
          {allUsersOnBoard.slice(0, 4).map(user => (
            <img key={user.id} src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-pm-dark-secondary" title={user.name} />
          ))}
          {allUsersOnBoard.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-pm-dark-secondary bg-pm-border flex items-center justify-center text-xs font-semibold">
              +{allUsersOnBoard.length - 4}
            </div>
          )}
        </div>
        
        <button className="px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 bg-pm-dark-secondary border border-pm-border hover:bg-pm-border">
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          <span>Filters</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsSwimlaneOpen(!isSwimlaneOpen)}
            className="px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-2 bg-pm-dark-secondary border border-pm-border hover:bg-pm-border"
          >
            <ViewColumnsIcon className="w-4 h-4" />
            <span>Group by</span>
          </button>
          {isSwimlaneOpen && (
            <div 
              onMouseLeave={() => setIsSwimlaneOpen(false)}
              className="absolute right-0 mt-2 w-48 bg-pm-dark-secondary border border-pm-border rounded-md shadow-lg z-10"
            >
              <div className="py-1">
                <a href="#" onClick={(e) => { e.preventDefault(); onSwimlaneChange('none'); setIsSwimlaneOpen(false); }} className={`block px-4 py-2 text-sm ${currentSwimlane === 'none' ? 'bg-pm-blue/20 text-pm-blue' : 'text-pm-text'} hover:bg-pm-border`}>
                  None
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); onSwimlaneChange('assignee'); setIsSwimlaneOpen(false); }} className={`flex items-center space-x-2 px-4 py-2 text-sm ${currentSwimlane === 'assignee' ? 'bg-pm-blue/20 text-pm-blue' : 'text-pm-text'} hover:bg-pm-border`}>
                  <UserIcon className="w-4 h-4" />
                  <span>Assignee</span>
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BoardHeader;
