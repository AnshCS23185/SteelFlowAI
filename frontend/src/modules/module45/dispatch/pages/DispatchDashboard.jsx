import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowRight, CheckCircle, AlertTriangle, TrendingUp, DollarSign, Activity, Package } from 'lucide-react';
import { module4Api } from '../../../../services/module4Api';

export default function DispatchDashboard() {
  const [kpis, setKpis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Using a static project ID for demonstration (as per mock data logic)
  const projectId = '1';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kpiData, recData] = await Promise.all([
        module4Api.fetchDispatchKPIs(projectId),
        module4Api.fetchDispatchRecommendations(projectId)
      ]);
      setKpis(kpiData);
      setRecommendations(recData);
    } catch (error) {
      console.error("Error fetching dispatch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (id) => {
    try {
      await module4Api.createDispatchBatch(projectId, id);
      alert('Dispatch Batch successfully created and sent to Module 5 (Transportation Optimization).');
      fetchData(); // Refresh to get updated recommended batches count
    } catch (error) {
      console.error("Error creating batch", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-text-secondary animate-pulse">Loading Intelligence Engine...</div>;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-border-base flex justify-between items-end">
        <div>
          <h2 className="text-[20px] font-display font-semibold text-text-primary flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-orange" />
            Dispatch Intelligence Engine
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Analyzing production and inventory to generate optimal dispatch recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KPI Section */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-base border border-border-base p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded text-emerald-500"><DollarSign className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Est. Immediate Revenue</p>
              <h3 className="text-xl font-display font-bold text-text-primary">${kpis?.estimated_immediate_revenue?.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-surface-base border border-border-base p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-brand-orange/10 rounded text-brand-orange"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Readiness Score</p>
              <h3 className="text-xl font-display font-bold text-text-primary">{kpis?.dispatch_readiness_percentage}%</h3>
            </div>
          </div>
          <div className="bg-surface-base border border-border-base p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded text-blue-500"><Package className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Ready / Pending Tickets</p>
              <h3 className="text-xl font-display font-bold text-text-primary">{kpis?.ready_tickets} / {kpis?.pending_tickets}</h3>
            </div>
          </div>
          <div className="bg-surface-base border border-border-base p-4 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded text-purple-500"><Truck className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Ready Weight (Tons)</p>
              <h3 className="text-xl font-display font-bold text-text-primary">{kpis?.ready_weight_tons} T</h3>
            </div>
          </div>
        </div>

        {/* Suggestion Lists */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-display border-b border-border-base pb-2">AI Dispatch Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item) => (
              <div key={item.id} className="p-6 bg-surface-base border border-border-base rounded-lg space-y-5 shadow-sm">
                <div className="flex justify-between items-start border-b border-border-base pb-4">
                  <div>
                    <span className={`inline-block mb-2 text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                      item.dispatch_priority === 'HIGH' || item.dispatch_priority === 'URGENT' ? 'bg-red-500/10 text-red-500' :
                      item.dispatch_priority === 'MEDIUM' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {item.dispatch_priority} Priority
                    </span>
                    <h4 className="font-bold text-text-primary text-lg font-display">{item.recommendation}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Dispatch Score</p>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-brand-orange text-sm font-bold text-brand-orange">
                      {Math.round(item.dispatch_score * 100)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mb-1">Reason</p>
                    <p className="text-sm text-text-primary">{item.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 bg-surface-elevated p-3 rounded border border-border-base">
                    <div>
                      <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Benefit</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{item.business_benefit}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-orange uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Risk</p>
                      <p className="text-xs text-text-secondary leading-relaxed">{item.possible_risk}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-base flex justify-between items-center">
                  <div className="text-xs text-text-secondary">
                    AI Confidence: <strong className="text-text-primary">{Math.round(item.confidence_score * 100)}%</strong>
                  </div>
                  <button
                    onClick={() => handleCreateBatch(item.id)}
                    className="flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange/90 transition-colors bg-brand-orange/10 px-4 py-2 rounded"
                  >
                    <span>Create Dispatch Batch</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {recommendations.length === 0 && (
              <div className="col-span-2 text-center p-12 bg-surface-base border border-dashed border-border-base rounded-lg text-text-secondary text-sm">
                No recommendations generated yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
