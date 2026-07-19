export default function AlertsPanel() {
  return (
    <div className="space-y-6 self-start">
      <div className="bg-surface-base border border-border-base p-5 rounded-lg space-y-3 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary pb-1.5 border-b border-border-base font-display">Active Highlights</h3>
        <div className="p-3 bg-brand-orange/5 border border-brand-orange/15 rounded text-text-primary">
          <strong className="block text-brand-orange font-bold uppercase text-[9px] tracking-wider mb-1">Production Alert</strong>
          Weld joint porosity check approved on Nagpur column mark `26B-G1`.
        </div>
      </div>
    </div>
  );
}
