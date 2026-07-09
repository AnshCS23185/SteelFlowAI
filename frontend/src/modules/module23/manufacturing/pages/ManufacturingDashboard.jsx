import { useState } from 'react';
import { HardHat, AlertTriangle, Play, CheckCircle } from 'lucide-react';

export default function ManufacturingDashboard() {
  const [activeSegment, setActiveSegment] = useState('Tracking');
  
  const [productionMarks, setProductionMarks] = useState([
    { id: '1', mark: '26B-G1', type: 'Girder', station: 'NDT Testing', progress: 100, status: 'QA Passed' },
    { id: '2', mark: '26B-G2', type: 'Girder', station: 'Welding Bay B', progress: 85, status: 'Welding' },
    { id: '3', mark: '27B-C1', type: 'Column', station: 'Fit-up Table 2', progress: 50, status: 'Assembling' },
    { id: '4', mark: '27B-C2', type: 'Column', station: 'Blasting Line', progress: 90, status: 'Rework Required' }
  ]);

  const [dailyLogs, setDailyLogs] = useState([
    { id: 'dp1', date: '2026-07-09', shift: 'Day Shift', desc: 'Welding completed on Girder 26B-G1. Connection fitting parameters adjusted.', supervisor: 'Marcus Vance' },
    { id: 'dp2', date: '2026-07-08', shift: 'Night Shift', desc: 'CNC Drilling completed on all W-Beams. Connection plates delivered.', supervisor: 'Marcus Vance' }
  ]);

  const handleUpdateStatus = (id, nextStatus, nextProg) => {
    setProductionMarks(prev => prev.map(item => 
      item.id === id ? { ...item, status: nextStatus, progress: nextProg } : item
    ));
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Sub tabs */}
      <div className="flex border-b border-border-base gap-6 pb-px">
        {['Tracking', 'Shop Floor Updates', 'Quality & Rework'].map((seg) => (
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

      {activeSegment === 'Tracking' && (
        <div className="space-y-6">
          <h3 className="text-[20px] font-display font-semibold text-text-primary">Production Tracking</h3>
          
          <div className="bg-surface-base border border-border-base rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-base bg-surface-elevated/45">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Member Mark</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Type</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Station</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-right">Progress</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-text-secondary text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base text-xs">
                {productionMarks.map((item) => (
                  <tr key={item.id} className="hover:bg-hover-bg transition-all">
                    <td className="px-6 py-4.5 font-bold text-[#F64A14]">{item.mark}</td>
                    <td className="px-6 py-4.5 text-text-secondary">{item.type}</td>
                    <td className="px-6 py-4.5 text-text-secondary">{item.station}</td>
                    <td className="px-6 py-4.5 text-text-secondary text-right font-bold">{item.progress}%</td>
                    <td className="px-6 py-4.5">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        item.status === 'QA Passed' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : item.status === 'Rework Required' 
                          ? 'bg-red-500/10 text-red-600' 
                          : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'QA Passed', 100)}
                        disabled={item.status === 'QA Passed'}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded font-bold uppercase text-[9px] disabled:opacity-20 cursor-pointer transition-all"
                      >
                        Pass QA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSegment === 'Shop Floor Updates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider font-display">Daily Shop Logs</h3>
            <div className="space-y-4">
              {dailyLogs.map((log) => (
                <div key={log.id} className="p-5 bg-surface-base border border-border-base rounded space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-text-secondary">
                    <span>{log.date} • {log.shift}</span>
                    <span>By {log.supervisor}</span>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed">{log.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-base border border-border-base p-6 rounded-lg self-start space-y-4">
            <h3 className="text-xs font-bold uppercase text-text-secondary tracking-wider font-display">Log Shift Updates</h3>
            <button 
              onClick={() => {
                setDailyLogs([
                  { id: String(dailyLogs.length+1), date: new Date().toISOString().split('T')[0], shift: 'Day Shift', desc: 'Welding completed on TR-B1. Connection parameter test results approved.', supervisor: 'Marcus Vance' },
                  ...dailyLogs
                ]);
              }}
              className="w-full py-2.5 bg-brand-orange text-white hover:bg-brand-orange/90 text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Post Simulation Log
            </button>
          </div>
        </div>
      )}

      {activeSegment === 'Quality & Rework' && (
        <div className="max-w-xl bg-surface-base border border-border-base p-6 rounded-lg space-y-6">
          <div className="flex items-center gap-2.5 text-text-primary">
            <AlertTriangle className="w-5.5 h-5.5 text-red-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary font-display">Rework & Defect Log Reports</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded space-y-1">
              <strong className="text-red-600 block">Mark Mark: 27B-C2 (Column)</strong>
              <p className="text-text-secondary">Ultrasonic testing revealed Connection plate weld lamination pores offset. Welder assigned for splice repair.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
