import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProjectSpecifications from '../components/ProjectSpecifications';
import DrawingUpload from '../components/DrawingUpload';
import ProjectTeam from '../components/ProjectTeam';
import { api } from '../../../../services/api';

export default function ProjectDetailsPage() {
  const { project } = useOutletContext();
  const [activeSubTab, setActiveSubTab] = useState('Details');
  
  const [supervisorName, setSupervisorName] = useState(project?.supervisorName || '');
  const [clientName, setClientName] = useState(project?.clientName || '');
  const [clientEmail, setClientEmail] = useState(project?.clientEmail || '');
  
  const [drawingsList, setDrawingsList] = useState([]);
  const [newDrawName, setNewDrawName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchShippingLists = async () => {
      if (project?.id) {
        try {
          const lists = await api.getShippingLists(project.id);
          setDrawingsList(lists.map(list => ({
            id: list.id,
            docNo: list.id.substring(0, 8),
            name: list.original_filename,
            size: 'N/A', // We don't store file size yet
            date: new Date(list.created_at || Date.now()).toISOString().split('T')[0]
          })));
        } catch (err) {
          console.error("Failed to fetch shipping lists", err);
        }
      }
    };
    fetchShippingLists();
  }, [project?.id]);

  const handleSaveDetails = (e) => {
    e.preventDefault();
    alert('Project configuration details updated successfully.');
  };

  const handleUploadDrawing = async (e) => {
    e.preventDefault();
    if (!newDrawName || !project?.id) return;
    
    setIsUploading(true);
    try {
      const response = await api.uploadShippingList(project.id, newDrawName);
      
      setDrawingsList([
        {
          id: response.id,
          docNo: response.id.substring(0, 8),
          name: response.original_filename,
          size: 'Unknown',
          date: new Date(response.created_at || Date.now()).toISOString().split('T')[0]
        },
        ...drawingsList
      ]);
      setNewDrawName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('Shipping list parsed and items loaded into inventory pipeline successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload and parse shipping list. Ensure it is a valid Excel/CSV format.');
    } finally {
      setIsUploading(false);
    }
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
          isUploading={isUploading}
          fileInputRef={fileInputRef}
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
