import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProjectSpecifications from '../components/ProjectSpecifications';
import DrawingUpload from '../components/DrawingUpload';
import ProjectTeam from '../components/ProjectTeam';

export default function ProjectDetailsPage() {
  const { project } = useOutletContext();
  const [activeSubTab, setActiveSubTab] = useState('Details');
  
  const [supervisorName, setSupervisorName] = useState(project?.supervisorName || '');
  const [clientName, setClientName] = useState(project?.clientName || '');
  const [clientEmail, setClientEmail] = useState(project?.clientEmail || '');
  
  const [drawingsList, setDrawingsList] = useState([
    { id: '1', docNo: 'SF-APX-DET-001', name: 'Anchor Bolt Layout Plan.pdf', size: '4.8 MB', date: '2026-06-15' },
    { id: '2', docNo: 'SF-APX-DET-002', name: 'Column Column Base Splice Welding.pdf', size: '8.2 MB', date: '2026-07-01' }
  ]);
  const [newDrawName, setNewDrawName] = useState('');

  const handleSaveDetails = (e) => {
    e.preventDefault();
    alert('Project configuration details updated successfully.');
  };

  const handleUploadDrawing = (e) => {
    e.preventDefault();
    if (!newDrawName) return;
    setDrawingsList([
      ...drawingsList,
      {
        id: String(drawingsList.length + 1),
        docNo: `SF-APX-DET-00${drawingsList.length + 1}`,
        name: newDrawName,
        size: '2.5 MB',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setNewDrawName('');
  };

  const subTabs = ['Details', 'Drawings & Shipping List', 'Stakeholders'];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex border-b border-border-base gap-6 pb-px">
        {subTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeSubTab === tab
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'Details' && (
        <ProjectSpecifications project={project} handleSaveDetails={handleSaveDetails} />
      )}

      {activeSubTab === 'Drawings & Shipping List' && (
        <DrawingUpload 
          drawingsList={drawingsList} 
          newDrawName={newDrawName} 
          setNewDrawName={setNewDrawName} 
          handleUploadDrawing={handleUploadDrawing} 
        />
      )}

      {activeSubTab === 'Stakeholders' && (
        <ProjectTeam 
          supervisorName={supervisorName}
          setSupervisorName={setSupervisorName}
          clientName={clientName}
          setClientName={setClientName}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
        />
      )}

    </div>
  );
}
