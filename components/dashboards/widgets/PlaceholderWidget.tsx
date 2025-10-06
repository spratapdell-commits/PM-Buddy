import React from 'react';

interface PlaceholderWidgetProps {
    title: string;
    message?: string;
}

const PlaceholderWidget: React.FC<PlaceholderWidgetProps> = ({ title, message }) => {
    return (
        <div className="flex items-center justify-center h-full text-center text-pm-text-secondary">
            <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm mt-1">{message || 'This widget is coming soon.'}</p>
            </div>
        </div>
    );
};

export default PlaceholderWidget;
