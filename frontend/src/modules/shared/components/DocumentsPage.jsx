import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services/api';
import { FileText } from 'lucide-react';

export default function DocumentsPage() {
  const { id } = useParams();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const docs = await api.getDocuments(id);
        const mappedDocs = docs.map(d => ({
          id: d.id,
          name: d.file_name,
          type: "Document",
          size: "Unknown",
          date: "Today",
          uploadedBy: "System"
        }));
        setDocuments(mappedDocs);
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    };
    fetchDocs();
  }, [id]);

  return (
    <div className="space-y-6 font-sans">
      <h3 className="text-[20px] font-display font-semibold text-text-primary">Project Shared Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="p-5 bg-surface-base border border-border-base rounded-lg flex gap-4 hover:border-brand-orange/20 transition-all">
            <FileText className="w-6 h-6 text-[#F64A14] flex-shrink-0" />
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="text-xs font-semibold text-text-primary truncate" title={doc.name}>
                {doc.name}
              </h4>
              <p className="text-[10px] text-text-secondary">{doc.type} • {doc.size}</p>
              <p className="text-[9px] text-text-secondary pt-2">By {doc.uploadedBy.split(' ')[0]} on {doc.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
