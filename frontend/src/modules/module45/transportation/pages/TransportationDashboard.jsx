import { useState } from 'react';
import { Truck, Navigation, FileText, CheckCircle } from 'lucide-react';

export default function TransportationDashboard() {
  const [vehicles, setVehicles] = useState([
    { id: '1', trailer: 'Deck Flatbed Heavy', carrier: 'Precision Heavy Haul', driver: 'Robert T.', status: 'In Transit Nagpur road' },
    { id: '2', trailer: 'Extendable Deck Standard', carrier: 'Apex Steel Logistics', driver: 'James K.', status: 'Awaiting load fit-up' }
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-border-base">
        <h2 className="text-[20px] font-display font-semibold text-text-primary font-display">Transportation & Carrier Logistics</h2>
        <p className="text-xs text-text-secondary mt-1">Simulate loaded deck space distribution, assign logistics carriers, and print shipping bills of lading.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3D Trailer simulation Canvas/SVG */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary font-display">3D Trailer Load Optimization</h3>
          
          <div className="bg-surface-base border border-border-base rounded-lg p-6 flex flex-col items-center justify-center">
            {/* Mock 3D Deck drawing */}
            <div className="w-full max-w-lg bg-surface-elevated border border-border-base rounded p-4 relative overflow-hidden flex flex-col items-center justify-center h-48">
              {/* Flatbed draw */}
              <div className="w-[85%] h-6 bg-text-secondary rounded relative mt-6 flex justify-between px-6 items-center">
                {/* Loaded beams */}
                <div className="absolute -top-6 left-12 w-28 h-6 bg-[#F64A14]/85 border border-[#F64A14] text-[9px] text-white flex items-center justify-center font-bold">26B-G1 (24.5T)</div>
                <div className="absolute -top-6 right-16 w-20 h-6 bg-[#FFD93D]/85 border border-[#FFD93D] text-[9px] text-text-primary flex items-center justify-center font-bold">TR-B1 (16.1T)</div>
                
                {/* Wheels */}
                <div className="absolute -bottom-3 left-6 w-5 h-5 rounded-full bg-[#111] border border-gray-400" />
                <div className="absolute -bottom-3 left-12 w-5 h-5 rounded-full bg-[#111] border border-gray-400" />
                <div className="absolute -bottom-3 right-6 w-5 h-5 rounded-full bg-[#111] border border-gray-400" />
                <div className="absolute -bottom-3 right-12 w-5 h-5 rounded-full bg-[#111] border border-gray-400" />
              </div>
            </div>
            
            <p className="text-[11px] text-text-secondary mt-3">Visual layout of deck load utilization. Current capacity: <strong className="text-brand-orange">84% optimized</strong>.</p>
          </div>
        </div>

        {/* Carrier assignments & dispatch docs */}
        <div className="space-y-6 self-start">
          <div className="bg-surface-base border border-border-base p-6 rounded-lg space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary pb-2 border-b border-border-base font-display">Carrier Assignment</h3>
            <div className="space-y-4">
              {vehicles.map((v) => (
                <div key={v.id} className="p-3 bg-surface-elevated rounded border border-border-base space-y-1">
                  <strong className="text-text-primary block">{v.trailer}</strong>
                  <span className="text-[10px] text-text-secondary block">{v.carrier} • Driver: {v.driver}</span>
                  <span className="text-[9px] text-brand-orange font-bold uppercase tracking-wider block pt-1 flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
