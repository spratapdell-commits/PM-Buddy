
import React, { useState } from 'react';
// FIX: Changed import to be relative
import { BoldIcon, ItalicIcon, CodeIcon, ListIcon, ListOrderedIcon } from './Icons';

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (value: string) => void;
  placeholder?: string;
  small?: boolean;
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, onSave, placeholder, small }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
      onSave(value);
      setIsEditing(false);
  };

  if (!isEditing && !small) {
    return (
      <div 
        onClick={() => setIsEditing(true)} 
        className="prose prose-invert prose-sm max-w-none p-3 rounded-md border border-transparent hover:border-pm-border cursor-pointer min-h-[80px]"
      >
        {/* In a real app, you'd render markdown here using a library like react-markdown */}
        {value ? <pre className="whitespace-pre-wrap font-sans text-pm-text">{value}</pre> : <p className="text-pm-text-secondary">Add a description...</p>}
      </div>
    );
  }

  return (
    <div className="bg-pm-dark rounded-md border border-pm-border focus-within:ring-2 focus-within:ring-pm-blue">
      <div className="flex items-center justify-between p-2 border-b border-pm-border">
        {/* This is a mock toolbar. In a real app, these buttons would format the text. */}
        <div className="flex items-center space-x-1">
            <button className="p-1.5 text-pm-text-secondary hover:bg-pm-border rounded"><BoldIcon className="w-4 h-4" /></button>
            <button className="p-1.5 text-pm-text-secondary hover:bg-pm-border rounded"><ItalicIcon className="w-4 h-4" /></button>
            <button className="p-1.5 text-pm-text-secondary hover:bg-pm-border rounded"><CodeIcon className="w-4 h-4" /></button>
            <button className="p-1.5 text-pm-text-secondary hover:bg-pm-border rounded"><ListIcon className="w-4 h-4" /></button>
            <button className="p-1.5 text-pm-text-secondary hover:bg-pm-border rounded"><ListOrderedIcon className="w-4 h-4" /></button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => !small && setIsEditing(true)}
        placeholder={placeholder}
        className={`w-full bg-transparent p-3 text-sm focus:outline-none resize-y ${small ? 'min-h-[60px]' : 'min-h-[120px]'}`}
      />
      {(isEditing || small) && (
        <div className="p-2 flex justify-end space-x-2">
            {isEditing && !small && <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm rounded-md hover:bg-pm-border">Cancel</button>}
            <button onClick={handleSave} className="px-3 py-1 text-sm rounded-md bg-pm-blue text-white font-semibold">Save</button>
        </div>
      )}
    </div>
  );
};

export default RichEditor;
