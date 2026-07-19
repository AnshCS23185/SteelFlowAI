export default function ProjectSpecifications({ project, handleSaveDetails }) {
  return (
    <form onSubmit={handleSaveDetails} className="space-y-6 max-w-xl bg-surface-base border border-border-base p-6 rounded-lg">
      <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary pb-2 border-b border-border-base font-display">Project Specifications</h3>
      
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase">Project Name</label>
          <input
            type="text"
            value={project?.name || ''}
            className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
            readOnly
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-text-secondary uppercase">Tonnage Allocation (Tons)</label>
          <input
            type="text"
            value={project?.tonnage || ''}
            className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
            readOnly
          />
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <label className="text-[10px] font-bold text-text-secondary uppercase">Project Description</label>
        <textarea
          rows={3}
          value={project?.description || ''}
          className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary resize-none"
          readOnly
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2.5 bg-brand-orange text-white hover:bg-brand-orange/90 text-xs font-semibold rounded cursor-pointer transition-colors"
        >
          Verify Allocation Specifications
        </button>
      </div>
    </form>
  );
}
