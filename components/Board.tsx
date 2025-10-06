
import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
// FIX: Changed import to be relative
import { Project, User, Issue, ColumnData as ColumnType, SwimlaneBy, Notification } from '../types';
import Column from './Column';
import Card from './Card';
import BoardHeader from './BoardHeader';
import GeminiInput from './GeminiInput';
// FIX: Changed import to be relative
import { USERS } from '../constants';
import * as api from '../api';
import SkeletonCard from './SkeletonCard';

// FIX: Changed import to be relative and corrected path.
const IssueDetailPanel = React.lazy(() => import('./IssueDetailModal'));

// A simple implementation of lexicographical ranking (like JIRA's LexoRank).
// In a real-world scenario, this would be more robust and handle edge cases and rebalancing.
const getRankBetween = (prevRank?: string, nextRank?: string): string => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const midChar = alphabet[Math.floor(alphabet.length / 2)];

  if (!prevRank && !nextRank) return midChar;

  if (!prevRank) { // Move to top
    return nextRank && nextRank[0] > alphabet[0] ? alphabet[alphabet.indexOf(nextRank[0]) -1] : '0' + nextRank;
  }

  if (!nextRank) { // Move to bottom
    return prevRank + 'z';
  }
  
  let i = 0;
  while(prevRank[i] === nextRank[i]) i++;

  if (i < prevRank.length && i < nextRank.length) {
    const prevCharIndex = alphabet.indexOf(prevRank[i]);
    const nextCharIndex = alphabet.indexOf(nextRank[i]);
    if (nextCharIndex - prevCharIndex > 1) {
      return prevRank.substring(0, i) + alphabet[prevCharIndex + 1];
    }
  }

  return prevRank.substring(0, i+1) + getRankBetween(prevRank.substring(i+1), nextRank.substring(i+1));
};


interface BoardProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  currentUser: User;
  logAction: (actor: User, action: string, details: Record<string, any>) => void;
  addNotification: (message: string) => void;
}

const Board: React.FC<BoardProps> = ({ project: initialProject, setProject, currentUser, logAction, addNotification }) => {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [swimlaneBy, setSwimlaneBy] = useState<SwimlaneBy>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<Project>(initialProject);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const [boardColumns, boardIssues] = await Promise.all([
            api.fetchBoard(initialProject.id),
            api.fetchIssues(initialProject.id)
        ]);
        
        setProjectData(prev => ({...prev, columns: boardColumns, issues: boardIssues }));
        setIsLoading(false);
    };
    fetchData();
  }, [initialProject.id]);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const issueKeyToOpen = params.get('open');
    if (issueKeyToOpen) {
        const issue = projectData.issues.find(i => i.key === issueKeyToOpen);
        if (issue) {
            setSelectedIssue(issue);
        }
    }
  }, [projectData.issues]);

  const handleSetSelectedIssue = (issue: Issue | null) => {
    setSelectedIssue(issue);
    const url = new URL(window.location.toString());
    if (issue) {
        url.searchParams.set('open', issue.key);
    } else {
        url.searchParams.delete('open');
    }
    window.history.replaceState({}, '', url);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = useMemo(() => projectData.columns, [projectData.columns]);
  
  const issuesById = useMemo(() => {
    return projectData.issues.reduce((acc, issue) => {
      acc[issue.id] = issue;
      return acc;
    }, {} as Record<string, Issue>);
  }, [projectData.issues]);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Issue') {
      setActiveIssue(event.active.data.current.issue);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;
    
    const activeIssueId = active.id.toString();
    const issueBeingMoved = projectData.issues.find(i => i.id === activeIssueId);
    if (!issueBeingMoved) return;

    let overColumn: ColumnType | undefined;
    if (over.data.current?.type === 'Column') {
      overColumn = over.data.current.column;
    } else if (over.data.current?.type === 'Issue') {
      const overIssueId = over.id.toString();
      overColumn = projectData.columns.find((col) => col.issueIds.includes(overIssueId));
    }

    if (!overColumn) return;
    
    // WIP Limit Enforcement (Hard Block Simulation)
    if (overColumn.wipLimit && overColumn.issueIds.length >= overColumn.wipLimit) {
        // In a real app, you would wait for a 409 from the server before showing this.
        // Here, we preemptively block for demonstration.
        alert(`WIP Limit Exceeded! The '${overColumn.title}' column can only have ${overColumn.wipLimit} issues. Your action has been rolled back.`);
        return; // This simulates the rollback. No state is changed.
    }
    
    setProjectData(prev => {
        const newProject = JSON.parse(JSON.stringify(prev));
        const activeColumn = newProject.columns.find((col: ColumnType) => col.issueIds.includes(activeIssueId));
        if (!activeColumn) return prev;
        
        let overDropColumn: ColumnType | undefined;
        let overIssueId: string | undefined;

        if (over.data.current?.type === 'Column') {
          overDropColumn = newProject.columns.find((c: ColumnType) => c.id === over.id);
        } else if (over.data.current?.type === 'Issue') {
          overIssueId = over.id.toString();
          overDropColumn = newProject.columns.find((col: ColumnType) => col.issueIds.includes(overIssueId!));
        }

        if (!overDropColumn) return prev;

        const activeIndex = activeColumn.issueIds.indexOf(activeIssueId);
        activeColumn.issueIds.splice(activeIndex, 1);
        
        let overIndex = overDropColumn.issueIds.length;
        if(overIssueId) {
            overIndex = overDropColumn.issueIds.indexOf(overIssueId);
        }
        
        overDropColumn.issueIds.splice(overIndex, 0, activeIssueId);

        const overColumnIssues = overDropColumn.issueIds.map((id: string) => newProject.issues.find((i: Issue) => i.id === id)).filter(Boolean);
        const sortedIssuesInOverColumn = [...overColumnIssues].sort((a,b) => a.rank.localeCompare(b.rank));
        const newIndexInSortedList = sortedIssuesInOverColumn.findIndex(i => i.id === activeIssueId);

        const prevIssue = sortedIssuesInOverColumn[newIndexInSortedList - 1];
        const nextIssue = sortedIssuesInOverColumn[newIndexInSortedList + 1];
        const newRank = getRankBetween(prevIssue?.rank, nextIssue?.rank);
        
        let statusChanged = false;
        newProject.issues = newProject.issues.map((issue: Issue) => {
            if (issue.id === activeIssueId) {
                statusChanged = issue.status !== overDropColumn!.title;
                if(statusChanged) {
                    logAction(currentUser, 'issue.status.update', { issueKey: issue.key, oldStatus: issue.status, newStatus: overDropColumn!.title });
                    addNotification(`${currentUser.name} moved ${issue.key} to "${overDropColumn!.title}".`);
                }
                logAction(currentUser, 'issue.rank.update', { issueKey: issue.key, newRank });
                return { ...issue, status: overDropColumn!.title, rank: newRank };
            }
            return issue;
        });
        
        setProject(newProject);
        return newProject;
    });
  };

  const handleTaskCreate = (newIssue: Issue) => {
    setProjectData(prev => {
        const todoColumn = prev.columns.find(c => c.title === 'To Do');
        if (!todoColumn) return prev;
        
        const updatedColumns = prev.columns.map(c => 
            c.id === todoColumn.id ? { ...c, issueIds: [newIssue.id, ...c.issueIds] } : c
        );

        const newProjectState = {
            ...prev,
            issues: [newIssue, ...prev.issues],
            columns: updatedColumns
        };
        setProject(newProjectState);
        return newProjectState;
    });
    logAction(currentUser, 'issue.create', { issueKey: newIssue.key, summary: newIssue.summary });
    addNotification(`${currentUser.name} created a new issue: ${newIssue.key}`);
  };
  
  const handleUpdateIssue = (updatedIssue: Issue) => {
    const updater = (p: Project) => ({
        ...p,
        issues: p.issues.map(i => i.id === updatedIssue.id ? updatedIssue : i)
    });
    setProjectData(updater);
    setProject(updater);
    handleSetSelectedIssue(updatedIssue);
  };
  
  const swimlanes = useMemo(() => {
    if (swimlaneBy === 'assignee') {
        const assigned: Record<string, Issue[]> = {};
        const unassigned: Issue[] = [];

        projectData.issues.forEach(issue => {
            if (issue.assignees.length > 0) {
                issue.assignees.forEach(assignee => {
                    if (!assigned[assignee.id]) {
                        assigned[assignee.id] = [];
                    }
                    assigned[assignee.id].push(issue);
                });
            } else {
                unassigned.push(issue);
            }
        });
        
        const grouped = Object.entries(assigned).map(([userId, issues]) => ({
            id: userId,
            title: USERS.find(u => u.id === userId)?.name || 'Unknown User',
            issues,
        }));

        if(unassigned.length > 0) {
            grouped.push({ id: 'unassigned', title: 'Unassigned', issues: unassigned });
        }
        return grouped;
    }
    return [{ id: 'all', title: 'All Issues', issues: projectData.issues }];
  }, [swimlaneBy, projectData.issues]);

  return (
    <>
      <BoardHeader 
        project={projectData} 
        currentSwimlane={swimlaneBy}
        onSwimlaneChange={setSwimlaneBy}
      />
      <GeminiInput 
        onTaskCreate={handleTaskCreate} 
        users={USERS} 
        projectKey={projectData.key}
        currentUser={currentUser} 
      />
      <div className="flex-1 flex flex-col gap-4 overflow-x-auto pt-4">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {swimlanes.map(lane => (
                <div key={lane.id} className={swimlaneBy !== 'none' ? 'mb-6' : ''}>
                    {swimlaneBy !== 'none' && (
                        <h2 className="text-md font-semibold mb-2 px-2 text-pm-text">{lane.title}</h2>
                    )}
                    <div className="flex gap-4">
                        <SortableContext items={columns.map(c => c.id)}>
                            {columns.map(column => {
                                if (isLoading) {
                                    return <Column key={column.id} column={column} issues={[]} isLoading onCardClick={() => {}} />;
                                }
                                
                                const issuesForColumn = column.issueIds
                                    .map(id => issuesById[id])
                                    .filter(Boolean)
                                    .filter(issue => lane.issues.some(laneIssue => laneIssue.id === issue.id))
                                    .sort((a,b) => a.rank.localeCompare(b.rank));
                                
                                return (
                                  <Column
                                    key={column.id}
                                    column={column}
                                    issues={issuesForColumn}
                                    onCardClick={handleSetSelectedIssue}
                                  />
                                )
                            })}
                        </SortableContext>
                    </div>
                </div>
            ))}
          <DragOverlay>
            {activeIssue ? <Card issue={activeIssue} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
      {selectedIssue && (
          <IssueDetailPanel
            issue={selectedIssue} 
            project={projectData}
            onClose={() => handleSetSelectedIssue(null)} 
            onUpdate={handleUpdateIssue}
            currentUser={currentUser}
            logAction={logAction}
          />
      )}
      </Suspense>
    </>
  );
};

export default Board;
