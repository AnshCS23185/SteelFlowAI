export default function ProjectSummaryCard({ description }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[20px] font-display font-semibold text-text-primary">Project Summary</h3>
      <p className="text-[15px] text-text-secondary leading-relaxed">
        {description} This operating workspace manages detailing parameter setups, material requirement forecasting, shop floor production logging, and logistics carriers dispatch coordination.
      </p>
    </div>
  );
}
