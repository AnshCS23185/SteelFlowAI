import { useOutletContext } from 'react-router-dom';

export default function OverviewPage() {
  const { project } = useOutletContext();

  if (!project) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-3">
          <h3 className="text-[20px] font-display font-semibold text-text-primary">Project Summary</h3>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            {project.description} This operating workspace manages detailing parameter setups, material requirement forecasting, shop floor production logging, and logistics carriers dispatch coordination.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[20px] font-display font-semibold text-text-primary">General Phase Timeline</h3>
          <div className="relative border-l border-border-base ml-4 space-y-6">
            {project.phases?.map((ph) => {
              const isDone = ph.progress === 100;
              return (
                <div key={ph.id} className="relative pl-6">
                  <span className={`absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-bg-base ${
                    isDone ? 'bg-[#F64A14]' : 'bg-text-muted/30'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-semibold ${isDone ? 'text-text-primary' : 'text-text-secondary'}`}>{ph.name}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">{isDone ? 'Completed' : `Running (${ph.progress}%)`}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 self-start">
        <div className="bg-surface-base border border-border-base p-5 rounded-lg space-y-3 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary pb-1.5 border-b border-border-base font-display">Active Highlights</h3>
          <div className="p-3 bg-brand-orange/5 border border-brand-orange/15 rounded text-text-primary">
            <strong className="block text-brand-orange font-bold uppercase text-[9px] tracking-wider mb-1">Production Alert</strong>
            Weld joint porosity check approved on Nagpur column mark `26B-G1`.
          </div>
        </div>
      </div>
    </div>
  );
}
