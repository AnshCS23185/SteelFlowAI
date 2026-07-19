import InspectionQueue from '../components/InspectionQueue';
import InspectionHistory from '../components/InspectionHistory';
import NCRTable from '../components/NCRTable';
import ReworkTracker from '../components/ReworkTracker';
import QAStatistics from '../components/QAStatistics';
import Certificates from '../components/Certificates';

export default function QualityDashboard() {
  return (
    <div className="space-y-4 font-sans text-sm text-[#111827] dark:text-white pb-12">
      <div className="border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
        <h1 className="text-2xl font-bold tracking-tight">Quality Control Dashboard</h1>
        <p className="text-[12px] text-[#6B7280] dark:text-gray-400 mt-0.5">Manage inspections, NCRs, and quality certificates.</p>
      </div>
      <QAStatistics />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InspectionQueue />
        <InspectionHistory />
        <NCRTable />
        <ReworkTracker />
      </div>
      <Certificates />
    </div>
  );
}
