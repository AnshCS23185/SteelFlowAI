export default function ActivityTimeline({ phases }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[20px] font-display font-semibold text-text-primary">General Phase Timeline</h3>
      <div className="relative border-l border-border-base ml-4 space-y-6">
        {phases?.map((ph) => {
          const isDone = ph.progress === 100;
          return (
            <div key={ph.id} className="relative pl-6">
              <span className={`absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full border-4 border-bg-base ${
                isDone ? 'bg-[#F64A14]' : 'bg-text-muted/30'
              }`} />
              <div>
                <h4 className={`text-sm font-semibold ${isDone ? 'text-text-primary' : 'text-text-secondary'}`}>{ph.name}</h4>
                <p className="text-xs text-text-secondary mt-0.5">{isDone ? 'Completed' : `Running (${ph.progress}%)`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
