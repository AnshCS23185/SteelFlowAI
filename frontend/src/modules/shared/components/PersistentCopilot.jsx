import { useState, useEffect } from 'react';
import { Send, X, BrainCircuit, RotateCcw, Sparkles, Database, AlertCircle, History } from 'lucide-react';
import { mockAiMessages } from '../../../utils/mockData';
import { motion } from 'framer-motion';

export default function PersistentCopilot({ isOpen, setIsOpen, project }) {
  const [activeTab, setActiveTab] = useState('Assistant');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages(mockAiMessages);
  }, [project?.id]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let replyContent = "Telemetry processed. ";
      const promptLower = userMsg.content.toLowerCase();

      if (promptLower.includes('weld') || promptLower.includes('ndt') || promptLower.includes('qa')) {
        replyContent += `QA inspection logs for ${project.name} indicate 96.5% visual pass rate. Ultrasonic NDT testing completed on load segment 26B-G1. Porosity limits on weld joints are fully within normal specifications.`;
      } else if (promptLower.includes('drawings') || promptLower.includes('design') || promptLower.includes('ifc')) {
        replyContent += "We are tracking 3 design drawing registers. Design Drawing 'Apex-T-IFC-Drawings-Rev3.pdf' is set as the active detailing baseline.";
      } else if (promptLower.includes('inventory') || promptLower.includes('beams') || promptLower.includes('plates')) {
        replyContent += "Current inventory levels check: W-Beams ordered 150, received 110. Stainless steel plates are sufficient for current fit-up phase.";
      } else if (promptLower.includes('shipping') || promptLower.includes('transport') || promptLower.includes('eta')) {
        replyContent += "Logistics update: Trailer load L-1104 is currently in transit with components for level 2 bracing, ETA remains Oct 10 14:00.";
      } else {
        replyContent += `I am analyzing the fabrication progress for ${project.name}. Detailing is 100% complete and raw procurement is at ${project.phases?.[1]?.progress || 0}%. What engineering spec or logistics load would you like to review next?`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: replyContent }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <aside className="w-80 border-l border-border-base bg-surface-base flex flex-col justify-between flex-shrink-0 z-20 h-full relative">
      
      {/* Top Header sticky */}
      <div className="border-b border-border-base bg-surface-base sticky top-0 z-10">
        <div className="h-12 px-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-primary">
            <BrainCircuit className="w-4 h-4 text-[#F64A14]" />
            <span>Copilot Terminal</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-surface-elevated rounded text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cursor AI Tabs */}
        <div className="flex border-t border-border-base px-2 gap-1 py-1">
          {['Assistant', 'Recommendations', 'Memory', 'Actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-surface-elevated text-brand-orange'
                  : 'text-text-secondary hover:bg-surface-elevated/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Assistant Chat */}
        {activeTab === 'Assistant' && (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className="text-[8px] font-bold text-text-secondary uppercase mb-0.5 tracking-widest">
                  {msg.role === 'user' ? 'Engineer' : 'AI Agent'}
                </span>
                <div className={`p-3 rounded text-[12px] leading-relaxed max-w-[92%] ${
                  msg.role === 'user'
                    ? 'bg-text-primary text-white dark:bg-white dark:text-[#111111] rounded-tr-none font-medium'
                    : 'bg-surface-elevated text-text-primary border border-border-base rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="p-3 bg-surface-elevated text-text-secondary rounded border border-border-base animate-pulse">
                Analyzing structural model metrics...
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {activeTab === 'Recommendations' && (
          <div className="space-y-3">
            <div className="p-3 bg-brand-orange/5 border border-brand-orange/15 rounded flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-text-primary text-[11px]">Material Shortage Detected</p>
                <p className="text-text-secondary text-[10px] mt-0.5">Welding wire stock level is below critical 10%. Procure immediate restock lot.</p>
              </div>
            </div>
            
            <div className="p-3 bg-surface-elevated border border-border-base rounded flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#F64A14] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-text-primary text-[11px]">NDT Optimization Tip</p>
                <p className="text-text-secondary text-[10px] mt-0.5">Scheduling visual weld testing sequentially before ultrasonic pass will reduce inspection wait times by 4 hours.</p>
              </div>
            </div>
          </div>
        )}

        {/* Memory */}
        {activeTab === 'Memory' && (
          <div className="space-y-3">
            <div className="p-3 bg-surface-elevated border border-border-base rounded space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                <Database className="w-3.5 h-3.5 text-brand-orange" />
                <span>Base Project Rules</span>
              </div>
              <div className="text-[10px] space-y-1 text-text-secondary">
                <div>Client: <strong className="text-text-primary">{project.clientName}</strong></div>
                <div>Tonnage Limit: <strong className="text-text-primary">{project.tonnage} Tons</strong></div>
                <div>Active Detailer: <strong className="text-text-primary">{project.supervisorName}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Actions */}
        {activeTab === 'Actions' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-[10px] text-text-secondary">
              <History className="w-3.5 h-3.5 text-text-muted mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary">Inventory Level Updated</p>
                <p className="text-[9px] text-text-muted">10 units of CHS members registered received by Marcus Vance.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-[10px] text-text-secondary">
              <History className="w-3.5 h-3.5 text-text-muted mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary">Weld Porosity Issue Logged</p>
                <p className="text-[9px] text-text-muted">High severity joint lamination report submitted on Mark 26B-G1.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Input sticky */}
      <div className="p-3 border-t border-border-base bg-surface-elevated/20 sticky bottom-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask AI about design rules or loads..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pl-3.5 pr-9 py-2 text-xs bg-surface-base border border-border-base rounded outline-none text-text-primary focus:border-[#F64A14]"
          />
          <button 
            type="submit"
            className="absolute right-1.5 p-1.5 bg-[#F64A14] text-white hover:bg-[#F64A14]/90 rounded cursor-pointer"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

    </aside>
  );
}
