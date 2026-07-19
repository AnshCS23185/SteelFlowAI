import { useOutletContext } from 'react-router-dom';
import ProjectSummaryCard from './components/ProjectSummaryCard';
import ActivityTimeline from './components/ActivityTimeline';
import AlertsPanel from './components/AlertsPanel';

export default function DashboardPage() {
  const { project } = useOutletContext();

  if (!project) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      <div className="lg:col-span-2 space-y-8">
        <ProjectSummaryCard description={project.description} />
        <ActivityTimeline phases={project.phases} />
      </div>
      <AlertsPanel />
    </div>
  );
}
