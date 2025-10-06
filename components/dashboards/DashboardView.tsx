
import React, { useState } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
// FIX: Changed import to be relative
import { Project, User, Widget as WidgetType } from '../../types';
import WidgetWrapper from './WidgetWrapper';
import MyWorkWidget from './widgets/MyWorkWidget';
import PlaceholderWidget from './widgets/PlaceholderWidget';
import CumulativeFlowDiagram from '../charts/CumulativeFlowDiagram';
import BurndownChart from '../charts/BurndownChart';
// FIX: Changed import to be relative
import { MOCK_SNAPSHOTS } from '../../constants';
import AddWidgetModal from './AddWidgetModal';
// FIX: Changed import to be relative
import { PlusIcon, ShareIcon } from '../Icons';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardViewProps {
    project: Project;
    currentUser: User;
}

const DashboardView: React.FC<DashboardViewProps> = ({ project, currentUser }) => {
    const dashboard = project.dashboards[0];
    const [widgets, setWidgets] = useState<WidgetType[]>(dashboard.widgets);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const onLayoutChange = (layout: Layout[]) => {
        const newWidgets = widgets.map(w => {
            const l = layout.find(item => item.i === w.id);
            if (l) {
                return { ...w, x: l.x, y: l.y, w: l.w, h: l.h };
            }
            return w;
        });
        setWidgets(newWidgets);
    };

    const renderWidget = (widget: WidgetType) => {
        switch (widget.type) {
            case 'my-work':
                return <MyWorkWidget currentUser={currentUser} issues={project.issues} onIssueClick={() => {}} />;
            case 'sprint-burndown':
                const activeSprint = project.sprints.find(s => s.status === 'active');
                if (!activeSprint) return <PlaceholderWidget title="Sprint Burndown" message="No active sprint." />;
                return <BurndownChart sprint={activeSprint} issues={project.issues.filter(i => i.sprintId === activeSprint.id)} />;
            case 'cumulative-flow':
                return <CumulativeFlowDiagram snapshots={MOCK_SNAPSHOTS} />;
            default:
                return <PlaceholderWidget title={widget.title} />;
        }
    };
    
    const handleAddWidget = (widgetType: WidgetType['type']) => {
        const newWidget: WidgetType = {
            id: `w-${Date.now()}`,
            type: widgetType,
            title: widgetType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            x: (widgets.length * 6) % 12,
            y: Infinity, // puts it at the bottom
            w: 6,
            h: 2
        };
        setWidgets([...widgets, newWidget]);
        setIsAddModalOpen(false);
    };
    
    const handleRemoveWidget = (widgetId: string) => {
        setWidgets(widgets.filter(w => w.id !== widgetId));
    };

    return (<>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{dashboard.name}</h1>
            <div className="flex items-center space-x-2">
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 bg-pm-blue text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-pm-blue/90">
                    <PlusIcon className="w-4 h-4" /><span>Add Widget</span>
                </button>
                 <button className="flex items-center space-x-2 bg-pm-dark-secondary border border-pm-border px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-pm-border">
                    <ShareIcon className="w-4 h-4" /><span>Share</span>
                </button>
            </div>
        </div>
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: widgets.map(w => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h })) }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
        >
            {widgets.map(widget => (
                <div key={widget.id}>
                    <WidgetWrapper title={widget.title} onRemove={() => handleRemoveWidget(widget.id)}>
                        {renderWidget(widget)}
                    </WidgetWrapper>
                </div>
            ))}
        </ResponsiveGridLayout>
        {isAddModalOpen && <AddWidgetModal onClose={() => setIsAddModalOpen(false)} onAddWidget={handleAddWidget} />}
    </>);
};

export default DashboardView;
