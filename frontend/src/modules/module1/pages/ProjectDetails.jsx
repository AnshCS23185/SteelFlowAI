import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Upload, User, ShieldAlert, Layers, CheckCircle } from 'lucide-react';

export default function ProjectDetails() {
  const { project, setProject } = useOutletContext();
  const [activeSubTab, setActiveSubTab] = useState('Details');
  
  const [supervisorName, setSupervisorName] = useState(project?.supervisorName || '');
  const [clientName, setClientName] = useState(project?.clientName || '');
  const [clientEmail, setClientEmail] = useState(project?.clientEmail || '');
  
  const [drawingsList, setDrawingsList] = useState([
    { id: '1', docNo: 'SF-APX-DET-001', name: 'Anchor Bolt Layout Plan.pdf', size: '4.8 MB', date: '2026-06-15' },
    { id: '2', docNo: 'SF-APX-DET-002', name: 'Column Column Base Splice Welding.pdf', size: '8.2 MB', date: '2026-07-01' }
  ]);
  const [newDrawName, setNewDrawName] = useState('');

  const handleSaveDetails = (e) => {
    e.preventDefault();
    alert('Project configuration details updated successfully.');
  };

  const handleUploadDrawing = (e) => {
    e.preventDefault();
    if (!newDrawName) return;
    setDrawingsList([
      ...drawingsList,
      {
        id: String(drawingsList.length + 1),
        docNo: `SF-APX-DET-00${drawingsList.length + 1}`,
        name: newDrawName,
        size: '2.5 MB',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setNewDrawName('');
  };

  const subTabs = ['Details', 'Drawings & Shipping List', 'Stakeholders'];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex border-b border-border-base gap-6 pb-px">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeSubTab === tab
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'Details' && (
        <form onSubmit={handleSaveDetails} className="space-y-6 max-w-xl bg-surface-base border border-border-base p-6 rounded-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary pb-2 border-b border-border-base font-display">Project Specifications</h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Project Name</label>
              <input
                type="text"
                value={project?.name}
                className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
                readOnly
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Tonnage Allocation (Tons)</label>
              <input
                type="text"
                value={project?.tonnage}
                className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-[10px] font-bold text-text-secondary uppercase">Project Description</label>
            <textarea
              rows={3}
              value={project?.description}
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
      )}

      {activeSubTab === 'Drawings & Shipping List' && (
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
      )}

      {activeSubTab === 'Stakeholders' && (
        <div className="max-w-xl bg-surface-base border border-border-base p-6 rounded-lg space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary pb-2 border-b border-border-base font-display">Assign Stakeholders</h3>
          
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Fabrication Supervisor</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="flex-1 p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
                />
                <button
                  type="button"
                  onClick={() => alert('Supervisor assignment updated')}
                  className="px-4 py-2.5 bg-surface-elevated border border-border-base text-text-primary rounded text-xs font-semibold cursor-pointer"
                >
                  Assign
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-border-base">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-3 bg-surface-elevated border border-border-base rounded outline-none text-text-primary"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Client invitation sent.')}
                className="py-2.5 px-4 bg-brand-orange text-white hover:bg-brand-orange/90 rounded text-xs font-semibold cursor-pointer"
              >
                Send Client Access Invite
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
