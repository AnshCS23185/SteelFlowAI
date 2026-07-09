import { useOutletContext } from 'react-router-dom';

export default function SettingsPage() {
  const { project } = useOutletContext();

  if (!project) return null;

  return (
    <div className="bg-surface-base border border-border-base p-6 rounded-lg max-w-lg space-y-4 font-sans">
      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary pb-2.5 border-b border-border-base font-display">Project Allocation Settings</h3>
      <div className="text-xs space-y-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase">Shop Fabrication Line Assignment</label>
          <input
            type="text"
            defaultValue={project.location}
            className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
            readOnly
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase">Supervisor Assigned</label>
          <input
            type="text"
            defaultValue={project.supervisorName}
            className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
