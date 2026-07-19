import { CheckCircle } from 'lucide-react';

export default function DrawingUpload({ drawingsList, newDrawName, setNewDrawName, handleUploadDrawing }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface-base border border-border-base rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border-base bg-surface-elevated/45">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary font-display">Detailing Drawing Baseline Registers</span>
        </div>
        
        <div className="divide-y divide-border-base">
          {drawingsList.map((dw) => (
            <div key={dw.id} className="p-4.5 flex justify-between items-center gap-4 text-xs">
              <div className="min-w-0 space-y-1">
                <span className="text-[9px] font-bold text-text-secondary bg-surface-elevated px-2 py-0.5 rounded">
                  {dw.docNo}
                </span>
                <h4 className="font-semibold text-text-primary">{dw.name}</h4>
                <p className="text-[10px] text-text-secondary">Uploaded {dw.date} • {dw.size}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-base border border-border-base p-6 rounded-lg self-start">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 font-display">Register Drawing / Detailing Sheet</h3>
        <form onSubmit={handleUploadDrawing} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Drawing Name</label>
            <input
              type="text"
              placeholder="e.g. Column Section Details.pdf"
              value={newDrawName}
              onChange={(e) => setNewDrawName(e.target.value)}
              className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-brand-orange text-white hover:bg-brand-orange/90 text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Upload IFC PDF File
          </button>
        </form>
      </div>
    </div>
  );
}
