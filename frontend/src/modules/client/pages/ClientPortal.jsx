import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  ClipboardList, 
  Clock, 
  Truck, 
  FileText, 
  ImageIcon, 
  HelpCircle,
  CheckCircle2,
  Calendar,
  Send,
  MessageSquare
} from 'lucide-react';

export default function ClientPortal() {
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Progress');
  
  // States
  const [inventory, setInventory] = useState([]);
  const [transportation, setTransportation] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const allProjects = await api.getProjects();
        const clientProj = allProjects[0]; // For demo, assume client only has 1 or we pick first

        if (clientProj) {
          const mappedProj = {
            ...clientProj,
            name: clientProj.title,
            progress: 0,
            supervisorName: "Assigned PM",
            deadline: "2027-01-01",
            tonnage: 0
          };
          setProject(mappedProj);
          
          setInventory(api.getInventory(clientProj.id));
          setTransportation(api.getTransportation(clientProj.id));
          setPhotos(api.getPhotos(clientProj.id));

          // Fetch real documents from GridFS
          const docs = await api.getDocuments(clientProj.id);
          setDocuments(docs.map(d => ({
            id: d.id,
            name: d.file_name,
            type: "Document",
            size: "Unknown",
            date: "Today"
          })));
        }
      } catch (err) {
        console.error("Failed to fetch client portal data", err);
      }
    };
    fetchClientData();
  }, [user]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-xs text-text-secondary animate-pulse">Loading client portal workspace...</p>
      </div>
    );
  }

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportMessage('');
      setSupportSubmitted(false);
      alert('Support query transmitted to fabrication manager.');
    }, 1500);
  };

  const tabs = [
    { name: 'Progress', icon: ClipboardList },
    { name: 'Timeline', icon: Clock },
    { name: 'Dispatch Status', icon: Truck },
    { name: 'Documents', icon: FileText },
    { name: 'Photos', icon: ImageIcon },
    { name: 'Support', icon: HelpCircle }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title Header */}
      <div className="pb-6 border-b border-border-base flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-orange-500/10 text-brand-orange">
            Client Portal
          </span>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary mt-2">
            {project.name}
          </h1>
          <p className="text-xs text-text-secondary mt-1 max-w-xl">
            Real-time shop progress, engineering compliance documents, and trailer dispatch schedules.
          </p>
        </div>

        <div className="p-3 bg-surface-base border border-border-base rounded flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-text-secondary uppercase font-bold block">Delivery Progress</span>
            <span className="font-bold text-brand-orange text-lg">{project.progress}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-base overflow-x-auto gap-6 pb-px">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.name;
          return (
            <button
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              className={`flex items-center gap-2 pb-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="pt-2">

        {/* Progress Tab */}
        {activeTab === 'Progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider">Overall Stage Progress</h3>
              <div className="space-y-4">
                {project.phases?.map((phase) => (
                  <div key={phase.id} className="p-4 bg-surface-base border border-border-base rounded">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-text-primary">{phase.name}</span>
                      <span className="text-text-secondary">{phase.progress}%</span>
                    </div>
                    <div className="h-1 bg-surface-elevated rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-brand-orange" style={{ width: `${phase.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-surface-base border border-border-base rounded-lg self-start space-y-6">
              <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider">Project Summary</h3>
              <div className="text-xs space-y-4">
                <div>
                  <span className="text-text-secondary block">Supervisor in Charge</span>
                  <span className="font-semibold text-text-primary">{project.supervisorName}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Due Deadline</span>
                  <span className="font-semibold text-text-primary">{project.deadline}</span>
                </div>
                <div>
                  <span className="text-text-secondary block">Allocated Steel Volume</span>
                  <span className="font-semibold text-text-primary">{project.tonnage} Tons</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'Timeline' && (
          <div className="max-w-xl mx-auto py-8">
            <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider mb-8">Fabrication Milestone Log</h3>
            <div className="relative border-l border-border-base ml-3 space-y-8">
              {project.phases?.map((phase, idx) => {
                const isCompleted = phase.progress === 100;
                return (
                  <div key={phase.id} className="relative pl-6">
                    <span className={`absolute -left-2.5 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-4 border-bg-base ${
                      isCompleted ? 'bg-brand-orange' : 'bg-text-muted/30'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </span>
                    <div className="space-y-1">
                      <h4 className={`text-xs font-bold ${isCompleted ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {phase.name}
                      </h4>
                      <p className="text-[10px] text-text-secondary">
                        {isCompleted ? 'Phase successfully completed and verified' : `Current Status: ${phase.progress}% in progress`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dispatch Status Tab */}
        {activeTab === 'Dispatch Status' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider">Steel Shipments Log</h3>
            <div className="overflow-x-auto bg-surface-base border border-border-base rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-base bg-surface-elevated/45">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Load ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Trailer Configuration</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Included Components</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-right">Load Weight</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Dispatch Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {transportation.length > 0 ? (
                    transportation.map((load) => (
                      <tr key={load.id} className="hover:bg-hover-bg transition-colors duration-180">
                        <td className="px-6 py-4 text-xs font-bold text-text-primary">{load.loadId}</td>
                        <td className="px-6 py-4 text-xs text-text-secondary">{load.trailerType}</td>
                        <td className="px-6 py-4 text-xs text-text-secondary truncate max-w-[200px]">{load.components}</td>
                        <td className="px-6 py-4 text-xs text-right font-semibold text-text-primary">{load.weight}</td>
                        <td className="px-6 py-4 text-xs text-text-secondary">{load.dispatchDate}</td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            load.status === 'Delivered' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : load.status === 'In Transit' 
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {load.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-xs text-text-secondary">No shipments currently scheduled.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'Documents' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider">Shared QA Reports & Specs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="p-5 bg-surface-base border border-border-base rounded flex items-start gap-4 hover:border-brand-orange/25 transition-all">
                  <div className="p-2.5 bg-brand-orange/5 rounded text-brand-orange">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-text-primary truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-text-secondary mt-0.5">{doc.type} • {doc.size}</p>
                    <div className="flex justify-between items-center mt-3 text-[9px] text-text-secondary">
                      <span>Uploaded {doc.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'Photos' && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider">Shop Fabrication Photo Log</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photos.map((ph) => (
                <div key={ph.id} className="bg-surface-base border border-border-base rounded overflow-hidden">
                  <img src={ph.url} alt={ph.caption} className="w-full h-48 object-cover" />
                  <div className="p-4 space-y-1">
                    <p className="text-xs font-semibold text-text-primary leading-relaxed">{ph.caption}</p>
                    <div className="flex justify-between text-[10px] text-text-secondary pt-1">
                      <span>By {ph.uploadedBy}</span>
                      <span>{ph.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'Support' && (
          <div className="max-w-lg mx-auto bg-surface-base border border-border-base rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 rounded-full text-[#F64A14]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider">Contact Engineering / Supervisor</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">Direct query routing to shop managers.</p>
              </div>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4 pt-4 border-t border-border-base">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Inquiry Description</label>
                <textarea
                  rows={4}
                  placeholder="Detail thickness adjustments request, weld compliance verification or design changes..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full p-3 text-xs bg-surface-elevated border border-border-base rounded outline-none text-text-primary resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={supportSubmitted}
                className="w-full py-2.5 bg-brand-orange text-white text-xs font-semibold rounded hover:bg-brand-orange/90 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{supportSubmitted ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
