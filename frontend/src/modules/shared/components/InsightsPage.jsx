export default function InsightsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
      <div className="bg-surface-base border border-border-base p-6 rounded-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-5 font-display font-bold">Shop Floor Tonnage Output</h3>
        <div className="h-44 flex items-end justify-between pt-6 px-2 relative text-xs">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-text-secondary">
            <div className="border-b border-border-base w-full pb-1">100 Tons</div>
            <div className="border-b border-border-base w-full pb-1">50 Tons</div>
            <div className="w-full">0</div>
          </div>
          {[['Mon', 45], ['Tue', 65], ['Wed', 90], ['Thu', 50], ['Fri', 80]].map(([day, val]) => (
            <div key={day} className="flex flex-col items-center gap-2 z-10 w-10">
              <span className="text-[9px] font-bold text-text-secondary">{val}T</span>
              <div className="w-4 bg-[#F64A14] rounded-t-sm" style={{ height: `${(val / 100) * 110}px` }} />
              <span className="text-[10px] font-semibold text-text-primary">{day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-base border border-border-base p-6 rounded-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-5 font-display font-bold">NDT Pass Rates</h3>
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Weld Radiographic Pass</span>
              <span className="text-emerald-500 font-bold">98.2%</span>
            </div>
            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '98.2%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between font-semibold mb-1">
              <span>Dimensional Tolerance Pass</span>
              <span className="text-amber-500 font-bold">91.4%</span>
            </div>
            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: '91.4%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
