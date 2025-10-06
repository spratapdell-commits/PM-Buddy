import React from 'react';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-pm-dark p-3 rounded-md border border-pm-border animate-pulse">
            <div className="h-4 bg-pm-border rounded w-3/4 mb-3"></div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                    <div className="w-16 h-4 bg-pm-border rounded"></div>
                </div>
                <div className="w-6 h-6 bg-pm-border rounded-full"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
