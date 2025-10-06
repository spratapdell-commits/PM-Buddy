
import React, { useState, useEffect } from 'react';
// FIX: Changed import to be relative
import { Attachment as AttachmentType } from '../types';
// FIX: Changed import to be relative
import { DocumentTextIcon, XCircleIcon } from './Icons';

interface AttachmentProps {
    attachment: AttachmentType;
    onRemove: (id: string) => void;
}

const Attachment: React.FC<AttachmentProps> = ({ attachment, onRemove }) => {
    const [uploadProgress, setUploadProgress] = useState(0);

    // Simulate upload progress for newly added files
    useEffect(() => {
        if (attachment.url.startsWith('blob:')) { // Only simulate for new local files
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);
            return () => clearInterval(interval);
        } else {
            setUploadProgress(100);
        }
    }, [attachment.url]);

    const isImage = attachment.mimeType.startsWith('image/');

    return (
        <div className="relative group bg-pm-dark border border-pm-border rounded-lg overflow-hidden">
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                {isImage ? (
                    <img src={attachment.url} alt={attachment.fileName} className="w-full h-24 object-cover" />
                ) : (
                    <div className="w-full h-24 flex items-center justify-center bg-pm-dark">
                        <DocumentTextIcon className="w-10 h-10 text-pm-text-secondary" />
                    </div>
                )}
            </a>
            <div className="p-2 text-xs">
                <p className="font-semibold truncate">{attachment.fileName}</p>
                <p className="text-pm-text-secondary">{(attachment.size / 1024).toFixed(1)} KB</p>
            </div>
            
            {uploadProgress < 100 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-full bg-pm-border rounded-full h-1.5 mx-4">
                        <div className="bg-pm-blue h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                </div>
            )}

            {uploadProgress === 100 && (
                 <button 
                  onClick={() => onRemove(attachment.id)} 
                  className="absolute top-1 right-1 p-0.5 bg-pm-dark rounded-full text-pm-text-secondary opacity-0 group-hover:opacity-100 hover:text-pm-red transition-opacity"
                  aria-label="Remove attachment"
                 >
                    <XCircleIcon className="w-5 h-5" />
                 </button>
            )}
        </div>
    );
};

export default Attachment;
