export default function ProjectTeam({ 
  supervisorName, setSupervisorName, 
  clientName, setClientName, 
  clientEmail, setClientEmail 
}) {
  return (
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
  );
}
