
import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// FIX: Changed import to be relative
import { ColumnData as ColumnType, Issue } from '../types';
import Card from './Card';
import SkeletonCard from './SkeletonCard';

interface ColumnProps {
  column: ColumnType;
  issues: Issue[];
  onCardClick: (issue: Issue) => void;
  isLoading?: boolean;
}

const Column: React.FC<ColumnProps> = ({ column, issues, onCardClick, isLoading }) => {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const isOverWip = column.wipLimit && issues.length > column.wipLimit;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 md:w-80 flex-shrink-0 flex flex-col"
    >
      <div className={`flex items-center justify-between px-2 py-2 ${isOverWip ? 'text-pm-orange font-semibold' : ''}`}>
        <h2 className="text-sm font-semibold uppercase text-pm-text-secondary">
          {column.title}
        </h2>
        <span className="text-sm">
          {isLoading ? '...' : issues.length}
          {column.wipLimit ? ` / ${column.wipLimit}` : ''}
        </span>
      </div>
      <div role="list" className="flex-1 bg-pm-dark-secondary rounded-md p-2 space-y-2 overflow-y-auto" {...attributes} {...listeners}>
        {isLoading ? (
            <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </>
        ) : (
            <SortableContext items={issues.map(i => i.id)}>
            {issues.map(issue => (
                <Card key={issue.id} issue={issue} onClick={() => onCardClick(issue)} />
            ))}
            </SortableContext>
        )}
      </div>
    </div>
  );
};

export default Column;
