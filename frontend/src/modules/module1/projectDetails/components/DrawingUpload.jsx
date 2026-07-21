import { CheckCircle } from 'lucide-react';

export default function DrawingUpload({ drawingsList, newDrawName, setNewDrawName, handleUploadDrawing, isUploading, fileInputRef }) {
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
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 font-display">Upload Shipping List (Excel/CSV)</h3>
        <form onSubmit={handleUploadDrawing} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Select File</label>
            <input
              type="file"
              accept=".xlsx,.csv"
              ref={fileInputRef}
              onChange={(e) => setNewDrawName(e.target.files[0])}
              className="w-full p-2 bg-surface-elevated border border-border-base rounded outline-none text-text-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-brand-orange file:text-white hover:file:bg-brand-orange/90 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-2.5 bg-brand-orange text-white text-xs font-semibold rounded transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-orange/90 cursor-pointer'}`}
          >
            {isUploading ? 'Uploading & Parsing...' : 'Upload and Parse List'}
          </button>
        </form>
      </div>
    </div>
  );
}
