import { useState } from 'react';
import { AlertCircle, Brain, TrendingUp, Info } from 'lucide-react';

export default function PlanningDashboard() {
  const [activeSegment, setActiveSegment] = useState('MRP');
  
  const mrpList = [
    { id: '1', item: 'Heavy Plate Girders', spec: 'A572 Gr50 2.5"', req: '120 Tons', stock: '90 Tons', shortage: '30 Tons', eta: '2026-07-15' },
    { id: '2', item: 'Web Connection Plates', spec: 'A36 1.0"', req: '80 Tons', stock: '80 Tons', shortage: '0 Tons', eta: 'In Stock' },
    { id: '3', item: 'Welding Consumables', spec: 'E7018 5/32"', req: '600 kg', stock: '200 kg', shortage: '400 kg', eta: '2026-07-12' }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Mini tabs */}
      <div className="flex border-b border-border-base gap-6 pb-px">
        {['MRP', 'Cost & AI Forecast', 'Risk Assessment'].map((seg) => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeSegment === seg
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {seg}
          </button>
        ))}
      </div>

      {activeSegment === 'MRP' && (
        <div className="space-y-6">
          <h3 className="text-[20px] font-display font-semibold text-text-primary">Material Requirement Planning (MRP)</h3>
          
          <div className="bg-surface-base border border-border-base rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-base bg-surface-elevated/45">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Material / Spec</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-right">Required Vol</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-right">Current Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-right">Shortage</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-center">ETA status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base text-xs">
                {mrpList.map((item) => (
                  <tr key={item.id} className="hover:bg-hover-bg transition-all">
                    <td className="px-6 py-4 font-semibold text-text-primary">{item.item} <span className="text-[10px] text-text-secondary block font-normal">{item.spec}</span></td>
                    <td className="px-6 py-4 text-text-secondary text-right">{item.req}</td>
                    <td className="px-6 py-4 text-text-secondary text-right">{item.stock}</td>
                    <td className="px-6 py-4 text-right font-bold">
                      {item.shortage !== '0 Tons' && item.shortage !== '0 kg' ? (
                        <span className="text-red-500">{item.shortage}</span>
                      ) : (
                        <span className="text-emerald-500">Fully supplied</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        item.eta === 'In Stock' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {item.eta}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSegment === 'Cost & AI Forecast' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-base border border-border-base p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-text-primary">
              <TrendingUp className="w-5 h-5 text-brand-orange" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Cost Prediction & Analysis</h3>
            </div>
            
            <div className="text-xs space-y-3 pt-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Allocated Budget</span>
                <span className="font-bold text-text-primary">$4.8M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Spent Tonnage Cost</span>
                <span className="font-bold text-text-primary">$2.1M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Predicted Remaining Costs</span>
                <span className="font-bold text-[#F64A14]">$2.5M</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-base border border-border-base p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-text-primary">
              <Brain className="w-5 h-5 text-brand-orange" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">AI Detailing Planning Recommendations</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Based on global logistics indicators, the price of A572 Grade steel plates is forecast to increase by 4% next quarter. Placing advance orders now secures structural detailing margins.
            </p>
          </div>
        </div>
      )}

      {activeSegment === 'Risk Assessment' && (
        <div className="max-w-xl bg-surface-base border border-border-base p-6 rounded-lg space-y-6">
          <div className="flex items-center gap-2.5 text-text-primary">
            <AlertCircle className="w-5.5 h-5.5 text-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Risk Analysis & Predictions</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded">
              <strong className="text-red-600 block mb-1">High Risk: Welding Consumables Shortage</strong>
              <p className="text-text-secondary leading-relaxed">E7018 wire levels are currently at 30% of target requirement. Shop floor assembly will stall in 4 days if deliveries fail.</p>
            </div>
            
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded">
              <strong className="text-amber-600 block mb-1">Medium Risk: Drawing Approval Delay</strong>
              <p className="text-text-secondary leading-relaxed">BIM detailing model splice connections details drawings are pending client approval for Nagpur expansion layout.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
