import { useState } from 'react';
import { ShieldCheck, Truck, ArrowRight, CheckCircle } from 'lucide-react';

export default function DispatchDashboard() {
  const [suggestions, setSuggestions] = useState([
    { id: '1', title: 'Load Optimization L-1104', type: 'Flatbed Standard', weight: '18.2 Tons', suggestion: 'Consolidate Nagpur girder 26B-G1 with Level 2 brace frames to optimize flatbed deck.', accepted: false },
    { id: '2', title: 'Load Optimization L-1115', type: 'Extendable Deck', weight: '31.0 Tons', suggestion: 'Combine Nagpur heavy girder segments `26B-G2` with structural stiffeners packages.', accepted: false }
  ]);

  const handleAcceptSuggestion = (id) => {
    setSuggestions(prev => prev.map(item => 
      item.id === id ? { ...item, accepted: true } : item
    ));
    alert('Logistics loading configuration approved and transmitted to dispatch.');
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-border-base">
        <h2 className="text-[20px] font-display font-semibold text-text-primary">Dispatch planning</h2>
        <p className="text-xs text-text-secondary mt-1">Review ready assemblies, dispatch suggestion loads, and schedule carrier trailer assignments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Suggestion Lists */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-display">AI Shipment Recommendations</h3>
          
          <div className="space-y-4">
            {suggestions.map((item) => (
              <div key={item.id} className="p-5 bg-surface-base border border-border-base rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">{item.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">{item.type} • {item.weight}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.accepted ? 'bg-emerald-500/10 text-emerald-600' : 'bg-brand-orange/10 text-brand-orange'
                  }`}>
                    {item.accepted ? 'Approved' : 'Awaiting Approval'}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{item.suggestion}</p>

                {!item.accepted && (
                  <button
                    onClick={() => handleAcceptSuggestion(item.id)}
                    className="flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange/90 transition-colors cursor-pointer"
                  >
                    <span>Approve Recommendation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Finished Goods stats */}
        <div className="space-y-6 self-start">
          <div className="bg-surface-base border border-border-base p-6 rounded-lg space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary pb-2 border-b border-border-base font-display">Finished Goods Tonnage</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Ready for Dispatch</span>
                <span className="font-bold text-text-primary">85.4 Tons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Dispatched Tonnage</span>
                <span className="font-bold text-text-primary">242.0 Tons</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
